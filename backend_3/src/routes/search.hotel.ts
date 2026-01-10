import expres from "express";
import {
  bookingConfirmation,
  paymentGateway,
  searchHotelfn,
  viewFullHotelDetails,
} from "../controllers/search.hotel.controller";
import { param } from "express-validator";
import { verifyUser } from "../middleware/verify";

const searchHotelRouter = expres.Router();

searchHotelRouter.get("/search", searchHotelfn);

searchHotelRouter.get(
  "/:id",
  [param("id").notEmpty().withMessage("hotel id must required")],
  viewFullHotelDetails
);

searchHotelRouter.post(
  "/:hotelId/bookings/payment-intent",
  verifyUser,
  paymentGateway
);

searchHotelRouter.post("/:hotelId/bookings", verifyUser, bookingConfirmation);

export default searchHotelRouter;
