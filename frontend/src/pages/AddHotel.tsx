import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../contexts/AppContext.tsx";
import { addMyHotel } from "../api_client.ts";
import ManageHotelForm from "../form/manageHotelForm2/ManageHotelForm.tsx";
// import type { HotelType } from "../../../backend_3/src/shared/type.ts";

export default function AddHotel() {
  let { showToast } = useAppContext();
  const mutation = useMutation({
    mutationFn: addMyHotel,
    onSuccess: (d) => {
      console.log(d);
      showToast({ message: "hotel add successfully", type: "Success" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "Error" });
    },
  });


  const handleAddForm = (hotelFormData:FormData)=>{
mutation.mutate(hotelFormData)
  }
  return (
    <>
      <ManageHotelForm onSave={handleAddForm} isLoading={mutation.isPending} />
    </>
  );
}
