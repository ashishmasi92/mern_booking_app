import express from "express";
import {
  hotelInput,
  getHotels,
  getHotelById,
  updateHotelById,
  homePageLatestHotel,
} from "../controllers/myhotel.conroller";
import upload from "../middleware/multer.middleware";
import { verifyUser } from "../middleware/verify";
import { body } from "express-validator";
const hotelRouter = express.Router();

hotelRouter.get("/", homePageLatestHotel);
hotelRouter.post(
  "/add-hotel",
  verifyUser,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("type").notEmpty().withMessage("type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("type is required"),
    body("facilities").notEmpty().isArray().withMessage("type is required"),
  ],
  upload.array("imageFiles", 6),
  hotelInput
);
hotelRouter.get("/hotels", verifyUser, getHotels);
hotelRouter.get("/hotel", verifyUser, getHotelById);
hotelRouter.put(
  "/hotel-update",
  verifyUser,
  upload.array("imageFiles", 6),
  updateHotelById
);
export default hotelRouter;
