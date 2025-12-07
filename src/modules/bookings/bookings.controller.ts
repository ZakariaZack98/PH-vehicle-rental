import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth";
import * as bookingService from "./bookings.service";

export async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const booking = await bookingService.createBooking(
      req.user!.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}

export async function getBookings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await bookingService.getBookings(req.user!);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function returnVehicle(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const booking = await bookingService.returnVehicle(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle returned successfully",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}
