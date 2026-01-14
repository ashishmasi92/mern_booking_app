import { useQuery } from "@tanstack/react-query";
import { fetchLatestHotel } from "../api_client";
import LatestDestinationCard from "../components/LatestDestinationCard";

export default function MyHome() {
  let { data: hotels } = useQuery({
    queryKey: ["fetch-Latest-Hotel"],
    queryFn: fetchLatestHotel,
  });
  console.log(hotels);

  const topRow = hotels?.slice(0, 2);
  const bottomRow = hotels?.slice(2);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Latest Hotels</h1>
      <p>Most Recents destination Added By Our host </p>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {topRow?.map((hotel) => {
            return <LatestDestinationCard key={hotel._id} hotel={hotel} />;
          })}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRow?.map((hotel) => {
            return <LatestDestinationCard key={hotel._id} hotel={hotel} />;
          })}
        </div>
      </div>
    </div>
  );
}
