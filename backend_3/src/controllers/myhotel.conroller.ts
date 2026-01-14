import type { Request, Response } from "express";
import uploadOnCloudinary from "../utils/uploader";
import customResponse from "../utils/customResponse";
import Hotel from "../models/hotel.model";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { HotelType } from "../shared/type";

export interface CustomJwt extends JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export async function uploadImg(
  imageFiles: Express.Multer.File[]
): Promise<string[]> {
  const uploadPromise = imageFiles.map(async (v) => {
    const b64 = Buffer.from(v.buffer).toString("base64");
    let datauri = "data:" + v.mimetype + ";base64," + b64;
    const res = await uploadOnCloudinary(datauri);

    if (!res) {
      throw new Error("cloudary upload failed");
    }

    return res;
  });

  const imgUrls = await Promise.all(uploadPromise);
  return imgUrls;
}

export async function hotelInput(req: Request, res: Response) {
  //  upload imgaes to cloudinary
  // if upload success add url to newHotel
  // then save it

  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel = req.body;
    let user = req.userInfo as CustomJwt;
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return customResponse(res, 401, false, "Invalid user id");
    }
    let userId = new mongoose.Types.ObjectId(user.id);

    //  upload images
    if (!imageFiles || imageFiles.length === 0) {
      return customResponse(res, 400, false, "No images uploaded");
    }

    let updateImg = await uploadImg(imageFiles);
    // console.log(updateImg);

    let hotelInstance = new Hotel({
      ...newHotel,
      lastUpdated: new Date(),
      imageUrls: updateImg,
      userId: userId,
    });
    let save = await hotelInstance.save();
    // console.log(save);

    return customResponse(
      res,
      201,
      true,
      "hotel info submit successfully",
      save
    );
  } catch (error) {
    console.log("error creating hotel", error);
    customResponse(res, 500, false, "internal error", error);
  }
}

//  return all hotel has been created by the user

export async function getHotels(req: Request, res: Response) {
  try {
    const user = req.userInfo as CustomJwt;

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return customResponse(res, 400, false, "invalid user id");
    }

    let userId = new mongoose.Types.ObjectId(user.id);

    let hotels = await Hotel.find({ userId: userId });

    if (!hotels || hotels.length === 0) {
      return customResponse(res, 404, false, "No hotels found for this user");
    }

    return customResponse(res, 200, true, "fetched successfully", hotels);
  } catch (error) {
    console.log("error where getting hotels", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}

export async function homePageLatestHotel(req: Request, res: Response) {
  try {
    let hotel = await Hotel.find().sort({ lastUpdated: -1 }).lean();
    // console.log(hotel);

    return customResponse(res, 200, true, "latest hotels", hotel);
  } catch (error) {
    console.log("error get Hotel", error);
    return customResponse(res, 500, false, "internal error");
  }
}

export async function getHotelById(req: Request, res: Response) {
  try {
    // console.log("hello world get Id",req.query);

    let id = req.query.id as string;
    let user = req.userInfo as CustomJwt;

    // console.log("userId,id",id,user);

    if (!user || !mongoose.Types.ObjectId.isValid(user.id)) {
      return customResponse(res, 401, false, "invalid user");
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return customResponse(res, 400, false, "invalid hotel id");
    }

    let userId = new mongoose.Types.ObjectId(user.id);
    const hotelId = new mongoose.Types.ObjectId(id);
    let hotel = await Hotel.findById(hotelId).where({ userId: userId }).lean();

    if (!hotel) {
      return customResponse(res, 400, false, "no hotel exist");
    }

    return customResponse(res, 200, true, "hotel found", hotel);
  } catch (error) {
    console.log("error hotelId ", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}

export async function updateHotelById(req: Request, res: Response) {
  try {
    let updatedData: HotelType = req.body;
    let user = req.userInfo as CustomJwt;
    let id = req.query.id as string;
    if (!user || !mongoose.Types.ObjectId.isValid(user.id)) {
      return customResponse(res, 403, false, "invalid user");
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return customResponse(res, 400, false, "invalid hotel id");
    }

    let userId = new mongoose.Types.ObjectId(user.id);
    let hotelId = new mongoose.Types.ObjectId(id);
    updatedData.lastUpdated = new Date();

    const updateHotel = await Hotel.findOneAndUpdate(
      {
        _id: hotelId,
        userId: userId,
      },
      {
        $set: updatedData,
      },
      {
        new: true,
      }
    );

    if (!updateHotel) {
      return customResponse(res, 400, false, "no hotel found and updated");
    }

    updateHotel.imageUrls = [...(updatedData.imageUrls ?? [])];

    let files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      let getUpdateImg = await uploadImg(files);
      console.log(getUpdateImg, updateHotel.imageUrls);
      updateHotel.imageUrls = [
        ...getUpdateImg,
        ...(updatedData.imageUrls ?? []),
      ];
    }

    // update img
    if (updateHotel.imageUrls.length == 0) {
      return customResponse(res, 400, false, "at least one image added");
    }

    await updateHotel.save();

    return customResponse(
      res,
      200,
      true,
      "hotel updated successfully",
      updateHotel
    );
  } catch (error) {
    console.log("error", error);
    return customResponse(res, 500, false, "internal error", error);
  }
}
