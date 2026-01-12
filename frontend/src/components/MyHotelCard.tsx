import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { BsBuilding, BsMap } from "react-icons/bs";
import type { HotelType } from "../../share/share";
import { Link } from "react-router-dom";
interface HotelFormProp {
  hotel: HotelType;
}

export default function MyHotelCard({ hotel }: HotelFormProp) {

  return (
    <>
      <h2 className="text-2xl font-bold ">{hotel.name}</h2>
      <div className="whitespace-pre-line">{hotel.description}</div>
      <div className="grid grid-cols-5 gap-2 text-[12px]">
        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
          <BsMap className="mr-1" />
          {hotel.city}, {hotel.country}
        </div>
        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
          <BsBuilding className="mr-1" />
          {hotel.type}
        </div>
        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
          <BiMoney className="mr-1" />
          ${hotel.pricePerNight} per night
        </div>
        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
          <BiHotel className="mr-1" />
          {hotel.adultCount} adults , {hotel.childCount} children
        </div>

        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
          <BiStar className="mr-1" />
          {hotel.starRating}
        </div>
      </div>
      <span className="flex justify-end">
        <Link
          to={`/edit-hotel/${hotel._id}`}
          
          className="flex bg-blue-600 text-white text-sm font-bold p-2 hover:bg-blue-500"
        >
          View Details
        </Link>
      </span>
    </>
  );
}
