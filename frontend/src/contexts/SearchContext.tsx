import { createContext, useContext, useState } from "react";

type searchContextProviderProps = {
  children: React.ReactNode;
};

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checlIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number
  ) => void;
};

const searchContext = createContext<SearchContext | undefined>(undefined);

export const useSearchContext = () => {
  let context = useContext(searchContext);
  return context as SearchContext;
};

export function SearchContextProvider({
  children,
}: searchContextProviderProps) {
  let [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  let [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  let [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  let [adultCount, setAdultCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("adultCount") || "1")
  );
  let [childCount, setChildCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("childCount") || "0")
  );
  let [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem("hotelId") || ""
  );

  function saveSearchValues(
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string
  ) {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (hotelId) {
      setHotelId(hotelId);
    }

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkIn.toISOString());
    sessionStorage.setItem("checkOut", checkOut.toISOString());
    sessionStorage.setItem("adultCount", adultCount.toString());
    sessionStorage.setItem("childCount", childCount.toString());

    if (hotelId) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  }

  return (
    <>
      <searchContext.Provider
        value={{
          destination,
          checkIn,
          checkOut,
          adultCount,
          childCount,
          hotelId,
          saveSearchValues,
        }}
      >
        {children}
      </searchContext.Provider>
    </>
  );
}
