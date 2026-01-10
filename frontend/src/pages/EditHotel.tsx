import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHotelById, updateHotelFn } from "../api_client";
import ManageHotelForm from "../form//manageHotelForm2/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

export default function EditHotel() {
  let { showToast } = useAppContext();
  let { hotelId } = useParams();
  let { data: hotel } = useQuery({
    queryKey: ["fetchHotelById"],
    queryFn: async () => {
      if (!hotelId) {
        throw new Error("no hotel id provided");
      }
      return getHotelById(hotelId || "");
    },
    enabled: !!hotelId,
  });


  let mutation = useMutation({
    mutationFn:updateHotelFn,
    onSuccess: () => {
      showToast({ message: "hotel updated!", type: "Success" });
    },
    onError: (error: Error) => {
      console.log(error);
      showToast({ message: error.message, type: "Error" });
    },
  });

  const updateFormFn = (hotelFormData:FormData) =>{
    if(!hotelId) return 
mutation.mutate({hotelId,hotelFormData})
  }

  return <ManageHotelForm  hotel={hotel} onSave={updateFormFn}  isLoading={mutation.isPending}  />;
}
