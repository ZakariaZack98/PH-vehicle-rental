import { Request, Response, NextFunction } from "express";
import * as vehiclesService from "./vehicles.service";

export async function createVehicle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Accept client-friendly payloads and map to service/db shape.
    // Client may send: { name, description, type, pricePerHour, registrationNumber }
    const name = req.body.name ?? req.body.vehicle_name;
    const registration_number =
      req.body.registrationNumber ??
      req.body.registration_number ??
      `REG-${Date.now()}`;
    const price = req.body.pricePerHour ?? req.body.daily_rent_price;

    const payload = {
      vehicle_name: name,
      type: req.body.type,
      registration_number,
      daily_rent_price: price,
      availability_status: req.body.availability_status,
    } as any;

    const vehicle = await vehiclesService.createVehicle(payload);

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
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
      data: vehicles,
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
    const id = Number(req.params.id);
    const vehicle = await vehiclesService.getVehicleById(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: vehicle,
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
    const id = Number(req.params.id);
    const updated = await vehiclesService.updateVehicle(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
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
    const id = Number(req.params.id);
    await vehiclesService.deleteVehicle(id);

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
