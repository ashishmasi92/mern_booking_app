import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

export default function HotelGuestForm() {
  let {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold">Guests</h2>

      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-300">
        <label htmlFor="" className="text-gray-300 text-sm font-semibold ">
          Adults
          <input
            type="number"
            className="border rounded w-full py-2 px-3 font-normal bg-white"
            {...register("adultCount", {
              required: "this field is required",
            })}
          />
          {errors.adultCount && (
            <span className="text-sm font-semibold text-red-400">
              {errors.adultCount.message}
            </span>
          )}
        </label>
        <label htmlFor="" className="text-gray-300 text-sm font-semibold ">
          Children
          <input
            type="number"
            className="border rounded w-full py-2 px-3 font-normal bg-white"
            {...register("childCount", {
              required: "this field is required",
            })}
          />
          {errors.childCount && (
            <span className="text-sm font-semibold text-red-400">
              {errors.childCount.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
}
