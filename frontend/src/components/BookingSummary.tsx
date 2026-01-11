import type { HotelType } from "../../../backend_3/src/shared/type";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType | undefined;
};

export default function BookingSummary({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-b capitalize">your booking</h2>
      <div className="border-b py-2 ">
        Location:
        <span className="font-bold">
          {hotel && `${hotel.name}, ${hotel.city} ${hotel.country}`}
        </span>
      </div>
      <div className="flex justify-between">
        <div className="">
          check-in <div className="font-bold">{checkIn.toDateString()}</div>
        </div>
        <div className="">
          check-out <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Total length of stay:
        <div className="font-bold">{numberOfNights}</div>
      </div>
      <div className="">
        Guest:
        <div className="font-bold">{adultCount} adults &</div>
        <div className="font-bold">{childCount} children</div>
      </div>
    </div>
  );
}
