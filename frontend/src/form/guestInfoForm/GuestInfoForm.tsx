import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

export type GuestFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

export default function GuestInfoForm({ hotelId, pricePerNight }: Props) {
  let search = useSearchContext();
  let navigate = useNavigate();
  const location = useLocation();
  let { isLoggedIn } = useAppContext();
  let {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestFormData>({
    defaultValues: {
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
    },
  });

  let checkIn = watch("checkIn");
  let checkOut = watch("checkOut");

  let minDate = new Date();
  let maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignIn = (data: GuestFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`, { state: { from: location } });
  };

  return (
    <div className="flex flex-col p-4 bg-blue-400 gap-4">
      <h3 className="text-md font-bold ">$ {pricePerNight}</h3>
      <form
        action=""
        onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignIn)}
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div className="">
            <DatePicker
              required
              selected={checkIn}
              onChange={(d: Date | null) => {
                if (d) {
                  setValue("checkIn", d);
                }
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="check-in date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="">
            <DatePicker
              required
              selected={checkOut}
              onChange={(d: Date | null) => {
                if (d) {
                  setValue("checkOut", d);
                }
              }}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn}
              maxDate={maxDate}
              placeholderText="check-in date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex">
              Children:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          <div className="">
            {isLoggedIn ? (
              <button className="bg-blue-600 text-white h-full w-full p-2 font-bold hover:bg-blue-500 text-xl">
                Book Now
              </button>
            ) : (
              <button className="bg-blue-600 text-white h-full w-full p-2 font-bold hover:bg-blue-500 text-xl">
                Sign in to Book
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
