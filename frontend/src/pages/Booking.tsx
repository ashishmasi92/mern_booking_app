import { useQuery } from "@tanstack/react-query";
import {
  createPaymentIntent,
  fetchCurrentUser,
  fetchHotelById,
} from "../api_client";
import BookingForm from "../form/bookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingSummary from "../components/BookingSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";


export default function Booking() {
  let { stripePromise } = useAppContext();
  let search = useSearchContext();
  let { hotelId } = useParams();
  let [numberOfNights, setNumberOfNights] = useState<number>(0);
  console.log(numberOfNights);

  const { data: paymentIntentData } = useQuery({
    queryKey: ["createPaymentIntent", hotelId, numberOfNights],
    queryFn: () => {
      return createPaymentIntent(hotelId as string, numberOfNights);
    },
    enabled: !!hotelId && numberOfNights > 0,
  });

  let { data: hotel } = useQuery({
    queryKey: ["fetchHotelById", hotelId],
    queryFn: () => {
      return fetchHotelById(hotelId as string);
    },
    enabled: !!hotelId,
  });

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.max(1, Math.ceil(nights)));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: currentuser } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: fetchCurrentUser,
  });

  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <BookingSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel?.data}
      />
      {currentuser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.data.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentuser?.data}
            paymentIntent={paymentIntentData.data}
          />
        </Elements>
      )}
    </div>
  );
}
