import type { RegisterFormData } from "./pages/Register";
import type { LoginFormData } from "./pages/Login";
import type { HotelSearchResponse, HotelType, UserType } from "../share/share";
import type { paymentIntentResponse } from "../share/share";
import type { BookingFormData } from "./form/bookingForm/BookingForm";
let url = import.meta.env.VITE_BASE_URL;
console.log("hello", url);

export async function registered(formData: RegisterFormData) {
  let response = await fetch(`${url}/api/v1/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  let d = await response.json();
  if (!response.ok) {
    throw new Error(d.message || "error");
  }
  return d;
}

export const validateToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${url}/api/v1/auth/validate-token`, {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();
    console.log(data);

    if (!response.ok && !data.success) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("error validate", error);
    return false; // ✅ MUST return something
  }
};

export async function loggedIn(formData: LoginFormData) {
  let response = await fetch(`${url}/api/v1/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  let d = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(d.message || "logged in failed");
  }
}

export async function logout() {
  try {
    let response = await fetch(`${url}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    console.log(response);
    let d = await response.json();
    if (!response.ok) {
      throw new Error(d.message);
    }

    return d;
  } catch (error) {
    console.log("error logout", error);
  }
}

export async function addMyHotel(hotelFormD: FormData) {
  let response = await fetch(`${url}/api/v1/my-hotel/add-hotel`, {
    method: "POST",
    credentials: "include",
    body: hotelFormD,
  });
  let d = await response.json();
  console.log(d);

  if (!response.ok) {
    throw new Error(d.message);
  }

  return d;
}

export async function getAllCreatedByUserHotels() {
  let response = await fetch(`${url}/api/v1/my-hotel/hotels`, {
    credentials: "include",
  });

  let d = await response.json();

  if (!response.ok) {
    throw new Error(d.message);
  }

  return d;
}

export async function getHotelById(id: string) {
  let hotelId = id;
  console.log(hotelId);

  let response = await fetch(`${url}/api/v1/my-hotel/hotel?id=${hotelId}`, {
    credentials: "include",
  });

  let d = await response.json();
  console.log(d);

  if (!response.ok) {
    throw new Error(d.message);
  }

  return d.data;
}

export async function updateHotelFn({
  hotelId,
  hotelFormData,
}: {
  hotelId: string;
  hotelFormData: FormData;
}) {
  let response = await fetch(
    `${url}/api/v1/my-hotel/hotel-update?id=${hotelId}`,
    {
      method: "PUT",
      credentials: "include",
      body: hotelFormData,
    }
  );

  let d = await response.json();

  if (!response.ok) {
    throw new Error(d.message);
  }
  console.log(d);

  return d;
}

export type SearchParams = {
  destination?: string;
  checkIn?: Date;
  checkOut?: Date;
  adultCount?: number;
  childCount?: number;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export async function searchHotels(
  searchParams: SearchParams
): Promise<HotelSearchResponse> {
  let querysearchParams = new URLSearchParams();

  querysearchParams.append("destination", searchParams.destination || "");
  querysearchParams.append(
    "checkIn",
    searchParams.checkIn?.toISOString() || ""
  );
  querysearchParams.append(
    "checkOut",
    searchParams.checkOut?.toISOString() || ""
  );
  querysearchParams.append(
    "adultCount",
    searchParams.adultCount?.toString() || ""
  );
  querysearchParams.append(
    "childCount",
    searchParams.childCount?.toString() || ""
  );
  querysearchParams.append("page", searchParams.page?.toString() || "");

  querysearchParams.append("maxPrice", searchParams.maxPrice || "");
  querysearchParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facilities) => {
    querysearchParams.append("facilities", facilities);
  });

  searchParams.types?.forEach((type) => {
    querysearchParams.append("types", type);
  });
  searchParams.stars?.forEach((star) => {
    querysearchParams.append("stars", star);
  });

  try {
    // console.log(
    //   "Fetching URL:",
    //   `${url}/api/v1/hotels/search?${querysearchParams}`
    // );
    let response = await fetch(
      `${url}/api/v1/hotels/search?${querysearchParams}`
    );

    // console.log("Response object:", response);

    let d = await response.json();
    // console.log("Response JSON:", d);

    if (!response.ok) {
      const text = await response.text(); // read HTML/error text
      console.error("Server returned error:", text);
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    return d.data;
  } catch (err) {
    console.error("Search hotels failed:", err);
    throw err;
  }
}

type ResponseType = {
  message: string;
  success: boolean;
  data: HotelType;
};

export const fetchHotelById = async (
  hotelId: string
): Promise<ResponseType> => {
  let response = await fetch(`${url}/api/v1/hotels/${hotelId}`);

  let d = await response.json();
  if (!response.ok) {
    throw new Error(d.message);
  }

  return d;
};

type Me = {
  message: string;
  success: boolean;
  data: UserType;
};

export async function fetchCurrentUser(): Promise<Me> {
  let response = await fetch(`${url}/api/v1/auth/me`, {
    credentials: "include",
  });

  let d = response.json();

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  return d;
}

type paymentIntentRes = {
  message: string;
  success: boolean;
  data: paymentIntentResponse;
};

export async function createPaymentIntent(
  hotelId: string,
  numberOfNights: number
): Promise<paymentIntentRes> {
  const response = await fetch(
    `${url}/api/v1/hotels/${hotelId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  let d = await response.json();

  if (!response.ok) {
    throw new Error("something went wrong");
  }

  return d;
}

export const BookARoom = async (formData: BookingFormData) => {
  let response = await fetch(
    `${url}/api/v1/hotels/${formData.hotelId}/bookings`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  let d = await response.json();
  console.log(d);

  if (!response.ok) {
    throw new Error("hotel confirmation booking error");
  }

  return d;
};
