import { Request, Response, NextFunction } from "express";
import * as vehiclesService from "./vehicles.service";

function formatVehicleForResponse(v: any) {
  if (!v) return v;
  return {
    ...v,
    type: v.type ? String(v.type).toLowerCase() : v.type,
    availability_status: v.availability_status
      ? String(v.availability_status).toLowerCase()
      : v.availability_status,
  };
}

export async function createVehicle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (
      !vehicle_name ||
      !type ||
      !registration_number ||
      daily_rent_price === undefined
    ) {
      throw { status: 400, message: "Missing required vehicle fields" };
    }

    const payload = {
      vehicle_name,
      type: String(type).toUpperCase(),
      registration_number,
      daily_rent_price: Number(daily_rent_price),
      availability_status: availability_status
        ? String(availability_status).toUpperCase()
        : undefined,
    } as any;

    const vehicle = await vehiclesService.createVehicle(payload);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: formatVehicleForResponse(vehicle),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllVehicles(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const vehicles = await vehiclesService.getVehicles();

    return res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: vehicles.map(formatVehicleForResponse),
    });
  } catch (err) {
    next(err);
  }
}

export async function getSingleVehicle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.vehicleId);
    const vehicle = await vehiclesService.getVehicleById(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: formatVehicleForResponse(vehicle),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateVehicle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.vehicleId);
    const payload: any = {};
    if (req.body.vehicle_name !== undefined)
      payload.vehicle_name = req.body.vehicle_name;
    if (req.body.type !== undefined)
      payload.type = String(req.body.type).toUpperCase();
    if (req.body.registration_number !== undefined)
      payload.registration_number = req.body.registration_number;
    if (req.body.daily_rent_price !== undefined)
      payload.daily_rent_price = Number(req.body.daily_rent_price);
    if (req.body.availability_status !== undefined)
      payload.availability_status = String(
        req.body.availability_status
      ).toUpperCase();

    const updated = await vehiclesService.updateVehicle(id, payload);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: formatVehicleForResponse(updated),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a vehicle by their id if there are no active bookings for the vehicle.
 *
 * @throws {Object} - error response with status 404 and message "Vehicle not found" if the vehicle with the given id does not exist
 * @throws {Object} - error response with status 400 and message "Cannot delete vehicle with active bookings" if the vehicle has active bookings
 * @param {number} id - vehicle id
 * @returns {Promise<boolean>} - promise resolving to true if the vehicle is deleted successfully
 */
export async function deleteVehicle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.vehicleId);
    await vehiclesService.deleteVehicle(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
