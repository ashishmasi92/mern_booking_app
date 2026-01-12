import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllCreatedByUserHotels } from "../api_client";
import MyHotelCard from "../components/MyHotelCard";
import type { HotelType } from "../../share/share";

export default function MyHotel() {
  let { data: hotels, isError } = useQuery({
    queryKey: ["hotels"],
    queryFn: getAllCreatedByUserHotels,
  });

  if (!hotels || hotels.data.length == 0) {
    console.log(isError);
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">NO HOTELS FOUND</h1>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Hotel</h1>
        <Link
          to="/add-hotel"
          className="flex font-semibold bg-blue-600 text-white text-sm p-2 hover:bg-blue-400"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotels.data &&
          hotels.data.map((hotel: HotelType, index:string) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
              >
                <MyHotelCard hotel={hotel} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
