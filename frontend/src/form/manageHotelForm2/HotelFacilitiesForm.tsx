import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../confi/hotel-options.config";
import type { HotelFormData } from "./ManageHotelForm";

export default function HotelFacilitiesForm() {
  let {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div>
      <h2 className="text-[20px] font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-5 gap-3">
        {hotelFacilities.map((facility, i) => {
          return (
            <label
              key={i}
              className="text-sm flex items-center gap-1 text-gray-700"
            >
              <input
                type="checkbox"
                {...register("facilities", {
                  required: "this field is required",
                  validate: (fac) => {
                    if (fac && fac.length == 0) {
                      return "At least one facilities is required";
                    }
                    return true;
                  },
                })}
                value={facility}
              />
              <span>{facility}</span>
            </label>
          );
        })}
        {errors.facilities && <span className="text-sm text-red-500 font-semibold " >{errors.facilities.message}</span>}
      </div>
    </div>
  );
}
