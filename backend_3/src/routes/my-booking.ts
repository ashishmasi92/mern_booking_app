import express from "express";
import { verifyUser } from "../middleware/verify";
import { getBookingHotel } from "../controllers/search.hotel.controller";

const bookingRouter = express.Router();

bookingRouter.get("/bookings-list", verifyUser, getBookingHotel);

export default bookingRouter;
