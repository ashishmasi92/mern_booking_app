import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "./ManageHotelForm";

export default function HotelImageForm() {
  let {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  let existingUrls = watch("imageUrls") || [];
  // console.log(existingUrls);

  const handleDeleteImage = (
    event:React.MouseEvent<HTMLButtonElement, MouseEvent>,
    image:string
  ) => {
event.preventDefault();
setValue("imageUrls",existingUrls.filter(img => img != image))


  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex  flex-col gap-5 ">
        <div className="grid grid-cols-6 gap-4">
          {existingUrls &&
            existingUrls.map((image) => {
              return (
                <div className="relative group">
                  <img src={image} className="min-h-full object-cover" />
                  <button onClick={(e)=>{
                    handleDeleteImage(e,image)
                  }} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-5 group-hover:opacity-100  text-white ">
                    Delete
                  </button>
                </div>
              );
            })}
        </div>
        <label htmlFor="">
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full text-gray-400 font-normal"
            {...register("imageFiles", {
              validate: (img) => {
                let len = (img?.length || 0) + existingUrls.length;

                if (len == 0) {
                  return "At least one image added";
                }
                if (len > 6) {
                  return "total number of images cannot greater than 6";
                }
                if(len>0){

                  return true;
                }
                return "no image"
              },
            })}
          />
        </label>
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-semibold ">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
}
