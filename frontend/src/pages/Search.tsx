import { useQuery } from "@tanstack/react-query";
import { useSearchContext } from "../contexts/SearchContext";
import { searchHotels } from "../api_client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import HotelFacilitiesFilter from "../components/HotelFacilitiesFilter";
import PriceFilter from "../components/PriceFilter";

export default function Search() {
  let search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedHotelFacilites, setSelectedHotelFacilities] = useState<
    string[]
  >([]);
  const [selectedPrice, setSelectedPrice] = useState<number>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adultCount: search.adultCount,
    childCount: search.childCount,
    page: page.toString(),
    stars: selectedStars,
    types: selectHotelTypes,
    facilities: selectedHotelFacilites,
    maxPrice: selectedPrice,
    sortOption: sortOption,
  };

  let { data: hotelData } = useQuery({
    queryKey: [
      "searchParams",
      search.destination,
      search.checkIn.toISOString(),
      search.checkOut.toISOString(),
      search.adultCount,
      search.childCount,
      page,
      selectedStars,
      selectHotelTypes,
      selectedHotelFacilites,
      selectedPrice,
      sortOption,
    ],
    queryFn: () => {
      return searchHotels(searchParams);
    },
  });

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prev) => {
      return event.target.checked
        ? [...prev, starRating]
        : prev.filter((st) => st !== starRating);
    });

    setPage(1);
  };

  const handleHotelTypesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectType = event.target.value;

    setSelectedHotelTypes((prev) =>
      event.target.checked
        ? [...prev, selectType]
        : prev.filter((type) => type !== selectType)
    );
  };

  const handleHotelFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedFacility = event.target.value;

    setSelectedHotelFacilities((prev) =>
      event.target.checked
        ? [...prev, selectedFacility]
        : prev.filter((facilities) => facilities !== selectedFacility)
    );
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-2 h-fit sticky top-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold border-b border-slate-300 pb-2">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectHotelTypes}
            onChange={handleHotelTypesChange}
          />

          <HotelFacilitiesFilter
            selectedHotelFacilites={selectedHotelFacilites}
            onChange={handleHotelFacilitiesChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}
        <div className="">
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(p) => {
              setPage(p);
            }}
          />
        </div>
      </div>
    </div>
  );
}
