import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchHotelById } from "../api_client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../form/guestInfoForm/GuestInfoForm";

export default function Details() {
  const { hotelId } = useParams();

  let { data: hotel, isLoading } = useQuery({
    queryKey: ["fetchHotelById", hotelId],
    queryFn: () => {
      return fetchHotelById(hotelId as string);
    },
    enabled: !!hotelId,
  });

  if (isLoading) {
    return <>loading...</>;
  }

  if (!hotel) {
    return null;
  }
  
  return (
    <div className="space-y-6 ">
      <div className="">
        <span className="flex ">
          {Array.from({ length: hotel.starRating ?? 0 }).map((_, i) => (
            <AiFillStar key={i} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {hotel?.data.imageUrls.map((img, i) => {
          return (
            <img
              className="rounded-md w-full h-full object-cover object-center
          "
              src={img}
              alt={hotel.data.name}
              key={i}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.data.facilities.map((facility, i) => {
          return (
            <div key={i} className="border border-slate-300 rounded--sm p-2">
              {facility}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2">
        <div className="whitespace-pre-line">{hotel.data.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.data.pricePerNight}
            hotelId={hotel.data._id}
          />
        </div>
      </div>
    </div>
  );
}
