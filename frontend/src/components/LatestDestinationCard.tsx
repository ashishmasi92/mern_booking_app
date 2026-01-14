import { Link } from "react-router-dom";
import type { HotelType } from "../../share/share";

type Props = {
  hotel: HotelType;
};

export default function LatestDestinationCard({ hotel }: Props) {
  let img = hotel.imageUrls || null;

  if (!img) {
    return null;
  }
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md"
    >
      <div className="h-[300px]">
        {img && (
          <img
            src={img[0]}
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-3xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
}
