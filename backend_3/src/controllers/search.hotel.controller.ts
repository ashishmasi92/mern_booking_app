import type { Request, Response } from "express";
import customResponse from "../utils/customResponse";
import Hotel from "../models/hotel.model";
import { HotelSearchResponse } from "../shared/type";
import { validationResult } from "express-validator";
import Stripe from "stripe";
import mongoose from "mongoose";
import { CustomJwt } from "./myhotel.conroller";
import { BookingType } from "../shared/type";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function constructSearchQuery(queryParams: any) {
  let constructedQuery: any = {};
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
}

export async function searchHotelfn(req: Request, res: Response) {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    let skip = (pageNumber - 1) * pageSize;

    let hotel = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // console.log(hotel);
    const total = await Hotel.countDocuments(query);

    if (hotel.length == 0) {
      return customResponse(res, 400, false, "no hotel get");
    }

    const response: HotelSearchResponse = {
      data: hotel,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    return customResponse(res, 200, true, "search successfully", response);
  } catch (error) {
    console.log("error search ", error);
    return customResponse(res, 500, false, "internal");
  }
}

export async function viewFullHotelDetails(req: Request, res: Response) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty) {
      return customResponse(res, 400, false, "error", err.array());
    }

    const id = req.params.id?.toString();

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return customResponse(res, 400, false, "no hotel find");
    }

    return customResponse(res, 200, true, "get hotel successfully", hotel);
  } catch (error) {
    console.log("error view", error);
    return customResponse(res, 500, false, "interal error");
  }
}

export async function paymentGateway(req: Request, res: Response) {
  // total cost
  // hotelId
  // userId
  try {
    const { numberOfNights } = req.body;
    const paramsHotelId = req.params.hotelId;
    const user = req.userInfo as CustomJwt;
    // console.log(numberOfNights, paramsHotelId);

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return customResponse(res, 401, false, "invalid user");
    }

    if (!paramsHotelId || !mongoose.Types.ObjectId.isValid(paramsHotelId)) {
      return customResponse(res, 400, false, "invlid hotel id");
    }
    let userId = new mongoose.Types.ObjectId(user.id);
    let hotelId = new mongoose.Types.ObjectId(paramsHotelId);

    let hotel = await Hotel.findById(hotelId).where({ userId: userId }).lean();

    if (!hotel) {
      return customResponse(res, 400, false, "no hotel found");
    }

    const totalCost = hotel.pricePerNight * numberOfNights;
    const amount = totalCost * 100;
    let paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        hotelId: paramsHotelId,
        userId: user.id,
      },
      payment_method_types: ["card"],
    });

    const response = {
      paymentIntenetId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      totalCost: totalCost,
    };

    return customResponse(res, 200, true, "payment Success", response);
  } catch (error) {
    console.log("error paymentIntent", error);
    return customResponse(res, 500, false, "internal error");
  }
}

export async function bookingConfirmation(req: Request, res: Response) {
  try {
    let hotelId = req.params.id;
    let user = req.userInfo as CustomJwt;
    const paymentIntentId = req.body.paymentIntentId;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );

    if (!paymentIntent) {
      return customResponse(res, 400, false, "payment intent not found");
    }

    if (
      paymentIntent.metadata.hotelId !== hotelId ||
      paymentIntent.metadata.userId !== user.id
    ) {
      return customResponse(res, 400, false, "payment intent mismatch");
    }

    if (paymentIntent.status !== "succeeded") {
      return customResponse(res, 400, false, "payment intent not succeed");
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: user.id,
    };

    const hotel = await Hotel.findByIdAndUpdate(
      {
        _id: hotelId,
        "bookings.paymentIntentId": { $ne: paymentIntentId },
      },
      {
        $push: { bookings: newBooking },
      },
      {
        new: true,
      }
    );
    if (!hotel) {
      return customResponse(
        res,
        404,
        false,
        "Hotel not found or booking already exists"
      );
    }

    return customResponse(res, 200, true, "Booking confirmed", hotel);
  } catch (error) {
    console.log("error bookings", error);
    return customResponse(res, 500, false, "internal error");
  }
}
