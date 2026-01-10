import { hotelFacilities } from "../confi/hotel-options.config";

type Props = {
  selectedHotelFacilites: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function HotelFacilitiesFilter({
  selectedHotelFacilites,
  onChange,
}: Props) {
  return (
    <div className="border-b border-slate-300 pb-2">
      <h4 className="text-md font-semibold mb-1">Hotel Types</h4>
      {hotelFacilities.map((type, index) => {
        return (
          <label key={index} className="flex items-center space-x-1">
            <input
              type="checkbox"
              className="rounded"
              value={type}
              checked={selectedHotelFacilites.includes(type)}
              onChange={onChange}
            />
            <span>{type} </span>
          </label>
        );
      })}
    </div>
  );
}
