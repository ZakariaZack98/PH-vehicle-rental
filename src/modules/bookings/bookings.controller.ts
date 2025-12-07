import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth";
import * as bookingService from "./bookings.service";

/**
 ** Formats a booking object for API response based on the current user's role
 * @param {any} booking - booking object to format
 * @param {{ userId: number; role: string }} currentUser - current user object with userId and role
 * @returns {Object} - formatted booking object with keys id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, and optionally vehicle and customer info
 */
function formatBookingForResponse(
  booking: any,
  currentUser: { userId: number; role: string }
) {
  if (!booking) return booking;

  const base = {
    id: booking.id,
    customer_id: booking.customerId,
    vehicle_id: booking.vehicleId,
    rent_start_date:
      booking.rent_start_date instanceof Date
        ? booking.rent_start_date.toISOString()
        : booking.rent_start_date,
    rent_end_date:
      booking.rent_end_date instanceof Date
        ? booking.rent_end_date.toISOString()
        : booking.rent_end_date,
    total_price: booking.total_price,
    status: booking.status
      ? String(booking.status).toLowerCase()
      : booking.status,
  } as any;

  if (booking.vehicle) {
    if (currentUser.role === "ADMIN") {
      base.vehicle = {
        vehicle_name: booking.vehicle.vehicle_name,
        registration_number: booking.vehicle.registration_number,
      };
    } else {
      base.vehicle = {
        vehicle_name: booking.vehicle.vehicle_name,
        registration_number: booking.vehicle.registration_number,
        type: booking.vehicle.type
          ? String(booking.vehicle.type).toLowerCase()
          : booking.vehicle.type,
      };
    }
  }
  if (currentUser.role === "ADMIN" && booking.customer) {
    base.customer = {
      name: booking.customer.name,
      email: booking.customer.email,
    };
  }

  return base;
}

export async function createBooking(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const vehicleId = req.body.vehicle_id ?? req.body.vehicleId;
    const payload = {
      vehicleId: Number(vehicleId),
      rent_start_date: req.body.rent_start_date,
      rent_end_date: req.body.rent_end_date,
    };

    const booking = await bookingService.createBooking(
      req.user!.userId,
      payload
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: formatBookingForResponse(booking, req.user!),
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
      data: data.map((b: any) => formatBookingForResponse(b, req.user!)),
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
    const id = Number(req.params.bookingId);
    const status = req.body.status?.toLowerCase();

    if (status === "returned") {
      //? Admin only return previlage
      const booking = await bookingService.returnVehicle(id);
      return res.status(200).json({
        success: true,
        message: "Vehicle returned successfully",
        data: formatBookingForResponse(booking, req.user!),
      });
    }

    if (status === "cancelled") {
      //? customer cancellation handling
      const booking = await bookingService.cancelBooking(id, req.user!);
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: formatBookingForResponse(booking, req.user!),
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid status update" });
  } catch (err) {
    next(err);
  }
}
