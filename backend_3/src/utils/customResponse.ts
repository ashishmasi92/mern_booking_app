import type { Response } from "express";

type customResponse = {
  res: Response;
  status: number;
  success: boolean;
  message: string;
};

export default function customResponse<T>(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: T | null = null
) {
  return res.status(status).json({
    success,
    message,
    data,
  });
}
