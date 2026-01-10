import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

export default function HotelDetailSection() {
  let {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-2xl font-bold mb-3">Add Hotel</h1>

      <div className="">
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Name
          <input
            type="text"
            {...register("name", {
              required: "this field is required",
            })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.name && (
            <span className="text-red-600">{errors.name?.message}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", {
              required: "this field must be required",
            })}
          />
          {errors.city && (
            <span className="text-red-600 text-sm">{errors.city.message}</span>
          )}
        </label>
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", {
              required: "this field must be required",
            })}
          />
          {errors.country && <span className="text-red-500 text-sm font-semibold" >{errors.country.message}</span>}
        </label>
      </div>

      <div className="">
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Description
          <textarea
            rows={5}
            cols={2}
            className="border rounded w-full py-2 px-2 font-normal"
            {...register("description", {
              required: "this field must be required",
            })}
          ></textarea>
        </label>
          {errors.description && (
            <span className="text-red-600 text-sm">
              {errors.description.message}
            </span>
          )}
      </div>

      <div>
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Price Per Night
          <input
            type="number"
            min={1}
            className="border rounded  py-2 px-2 ml-2 font-normal w-[50%]"
            {...register("pricePerNight", {
              required: "this field must be required",
            })}
          />
          {errors.pricePerNight && <span className="text-red-500 text-sm font-semibold" >{errors.pricePerNight.message}</span>}
        </label>
      </div>

      <div>
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Star Rating
          <select
            className="w-[40%] ml-3"
            {...register("starRating", {
              required: "this field is required",
              valueAsNumber: true,
            })}
          >
            <option value="Select a Rating" className="text-sm font-bold">
              Select a Rating
            </option>
            {[1, 2, 3, 4, 5].map((rat, i) => {
              return (
                <option key={i} value={rat} className="text-sm font-bold">
                  {rat}
                </option>
              );
            })}
          </select>
          {errors.starRating && <span className="text-red-500 text-sm font-semibold" >{errors.starRating.message}</span>}
        </label>
      </div>
    </div>
  );
}
