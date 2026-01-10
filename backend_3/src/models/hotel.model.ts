import mongoose, { Document, Types } from "mongoose";
import { HotelType } from "../shared/type";
import { BookingType } from "../shared/type";

const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: {
    type: String,
    reqired: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  adultCount: {
    type: Number,
    min: 1,
    max: 4,
    default: 1,
    required: true,
  },
  childCount: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

const hotelSchema = new mongoose.Schema<HotelType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    adultCount: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
      required: true,
    },
    childCount: {
      type: Number,
      min: 0,
      max: 4,

      required: true,
    },
    facilities: {
      type: [String],
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    imageUrls: { type: [String], required: true },
    lastUpdated: {
      type: Date,
      required: true,
    },
    bookings: [bookingSchema],
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;
