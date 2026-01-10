import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";
import { hotelTypes } from "../../confi/hotel-options.config";

export default function HotelTypeSection() {
  let {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  let typewatch = watch("type");
  return (
    <div>
      <h2 className="text-[20px] font-bold mb-3">Type</h2>
     
      <div className="grid grid-cols-5 gap-3">
        {hotelTypes.map((type, i) => {
          return (
            <label
              key={i}
              className={
                typewatch === type
                  ? "cursor-pointer bg-blue-400 text-sm rounded-full px-4 font-semibold"
                  : "cursor-pointer bg-gray-400 text-sm rounded-full px-4 py-2 font-semibold"
              }
            >
              <input
                type="radio"
                value={type}
                {...register("type", {
                  required: "this field is required",
                })}
                className="hidden"
              />
              <span>{type}</span>
            </label>
          );
        })}
      </div>
      {errors.type && (
        <span className="text-red-700 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
}
