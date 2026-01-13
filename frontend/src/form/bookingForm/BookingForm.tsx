import { useForm } from "react-hook-form";
import type { paymentIntentResponse, UserType } from "../../../share/share";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";

import { useMutation } from "@tanstack/react-query";
import { BookARoom } from "../../api_client";
import { useAppContext } from "../../contexts/AppContext";
import { useParams } from "react-router-dom";
type Props = {
  currentUser: UserType;
  paymentIntent: paymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

export default function BookingForm({ currentUser, paymentIntent }: Props) {
  let stripe = useStripe();
  let { hotelId } = useParams();
  let { showToast } = useAppContext();
  let elements = useElements();
  const search = useSearchContext();

  // console.log("hotel booking", hotelId);

  let { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      paymentIntentId: paymentIntent.paymentIntentId,
      totalCost: paymentIntent.totalCost,
      hotelId: hotelId?.toString(),
    },
  });

  const mutation = useMutation({
    mutationFn: BookARoom,
    onSuccess: () => {
      showToast({ message: "payment succeeded", type: "Success" });
    },
    onError: () => {
      showToast({ message: "payment failed", type: "Error" });
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }
    console.log("submit");

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: {
            postal_code: "12345",
          },
        },
      },
    });
    if (result.error) {
      showToast({
        message: result.error.message || "Payment failed",
        type: "Error",
      });
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      mutation.mutate({
        ...formData,
        paymentIntentId: result.paymentIntent.id,
      });
    }

    if (result.paymentIntent?.status == "succeeded") {
      //  book the room
      mutation.mutate({
        ...formData,
        paymentIntentId: result.paymentIntent.id,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 rouned-lg border border-slate-200 p-4 "
        action=""
      >
        <span className="text-2xl font-bold">Confirm Your Details</span>
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-700 text-sm font-bold flex-1" htmlFor="">
            First Name
            <input
              type="text"
              readOnly
              disabled
              {...register("firstName")}
              className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-300"
            />
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1" htmlFor="">
            Last Name
            <input
              type="text"
              readOnly
              disabled
              {...register("lastName")}
              className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-300"
            />
          </label>

          <label className="text-gray-700 text-sm font-bold flex-1" htmlFor="">
            Email{" "}
            <input
              type="text"
              readOnly
              disabled
              {...register("email")}
              className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-300"
            />
          </label>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold ">Your Price Summary:</h2>

          <div className="bg-blue-200 p-4 rounded-md">
            <div className="font-semibold text-lg ">
              Total Cost: ${paymentIntent.totalCost.toFixed(2)}
            </div>
            <div className="text-xs">Includes tas and charges</div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold capitalize ">
              payment datails
            </h3>
            <CardElement
              id="payment-element"
              className="border rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            disabled={mutation.isPending}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
          >
            {mutation.isPending ? "Saving..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </>
  );
}
