import { useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const search = useSearchContext();
  let navigate = useNavigate();
  let [destination, setDestination] = useState<string>(search.destination);
  let [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  let [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  let [adultCount, setAdultCount] = useState<number>(search.adultCount);
  let [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );

    navigate("/search");
  };

  let minDate = new Date();
  let maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="-mt-8 p-2 bg-orange-400 rounded shadow-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  items-center gap-3 "
      >
        <div className="flex flex-row items-center flex-1 bg-white p-2">
          <MdTravelExplore size={25} className="mr-2" />
          <input
            placeholder="Where are you going?"
            className="text-md w-full focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </div>

        <div className="flex bg-white px-2 py-1 gap-2">
          <label htmlFor="" className="items-center flex">
            Adult:
            <input
              type="number"
              min={1}
              max={20}
              value={adultCount}
              onChange={(e) => {
                setAdultCount(parseInt(e.target.value) || 1);
              }}
              className="w-full p-1 focus:outline-none font-bold"
            />
          </label>
          <label htmlFor="" className="className=items-center flex">
            <input
              type="number"
              min={0}
              max={20}
              value={childCount}
              onChange={(e) => {
                setChildCount(parseInt(e.target.value) || 0);
              }}
              className="w-full p-1 focus:outline-none font-bold"
            />
          </label>
        </div>
        <div className="">
          <DatePicker
            selected={checkIn}
            onChange={(date) => {
              setCheckIn(date as Date);
            }}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="ckeck in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>

        <div className="">
          <DatePicker
            selected={checkOut}
            onChange={(date) => {
              setCheckOut(date as Date);
            }}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="ckeck in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>
        <div className="flex gap-1">
          <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-sm hover:bg-blue-400">
            Search
          </button>

          <button
            type="button"
            className="w-15 bg-red-600 text-white h-full p-2 font-bold text-sm hover:bg-red-400"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
