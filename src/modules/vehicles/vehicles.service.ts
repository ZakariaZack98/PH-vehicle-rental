import { prisma } from "../../config/prisma";
import { BookingStatus } from "@prisma/client";


/**
 ** Creates a new vehicle with the given data.
 * 
 * @throws {Object} - error response with status 400 and message "Missing required vehicle fields" if any of the required fields are missing
 * 
 * @param {Object} data - vehicle data to create with keys vehicle_name, type, registration_number, daily_rent_price and optional availability_status
 * @returns {Promise<Object>} - promise resolving to the created vehicle object in the shape of the API reference
 */
export async function createVehicle(data: {
  vehicle_name: string;
  type: "CAR" | "BIKE" | "VAN" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "AVAILABLE" | "BOOKED";
}) {

  const { vehicle_name, type, registration_number, daily_rent_price } = data;
  if (!vehicle_name || !type || !registration_number || daily_rent_price === undefined) {
    throw { status: 400, message: "Missing required vehicle fields" };
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price: Number(daily_rent_price),
      availability_status: data.availability_status ?? "AVAILABLE",
    },
  });

  return vehicle;
}

//** get all vehicles
export async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { id: "asc" },
  });
  return vehicles;
}

//** get vehicle by id
export async function getVehicleById(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw { status: 404, message: "Vehicle not found" };
  }
  return vehicle;
}


/**
 ** Updates a vehicle by their id with the given data.
 * 
 * @param {number} id - vehicle id
 * @param {Partial<{vehicle_name: string; type: "CAR" | "BIKE" | "VAN" | "SUV"; registration_number: string; daily_rent_price: number; availability_status: "AVAILABLE" | "BOOKED";}>} data - vehicle data to update with keys vehicle_name, type, registration_number, daily_rent_price and optional availability_status
 * @returns {Promise<Object>} - promise resolving to the updated vehicle object in the shape of the API reference
 * @throws {Object} - error response with status 404 and message "Vehicle not found" if the vehicle with the given id does not exist
 * @throws {Object} - error response with status 400 and message "Registration number already exists" if the registration number is being updated and already exists for another vehicle
 */
export async function updateVehicle(
  id: number,
  data: Partial<{
    vehicle_name: string;
    type: "CAR" | "BIKE" | "VAN" | "SUV";
    registration_number: string;
    daily_rent_price: number;
    availability_status: "AVAILABLE" | "BOOKED";
  }>
) {
  //TODO: Ensure vehicle exists
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Vehicle not found" };
  }

  //TODO: If registration_number is being updated, ensure uniqueness (Prisma will also enforce, this gives nicer error)
  if (data.registration_number && data.registration_number !== existing.registration_number) {
    const dup = await prisma.vehicle.findUnique({
      where: { registration_number: data.registration_number },
    });
    if (dup) {
      throw { status: 400, message: "Registration number already exists" };
    }
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data: {
      vehicle_name: data.vehicle_name ?? undefined,
      type: data.type ?? undefined,
      registration_number: data.registration_number ?? undefined,
      daily_rent_price:
        data.daily_rent_price !== undefined ? Number(data.daily_rent_price) : undefined,
      availability_status: data.availability_status ?? undefined,
    },
  });

  return updated;
}


/**
 ** Deletes a vehicle by their id if there are no active bookings for the vehicle.
 * 
 * @throws {Object} - error response with status 404 and message "Vehicle not found" if the vehicle with the given id does not exist
 * @throws {Object} - error response with status 400 and message "Cannot delete vehicle with active bookings" if the vehicle has active bookings
 * @param {number} id - vehicle id
 * @returns {Promise<boolean>} - promise resolving to true if the vehicle is deleted successfully
 */
export async function deleteVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });

  if (!vehicle) {
    throw { status: 404, message: "Vehicle not found" };
  }
  if (vehicle.availability_status === "BOOKED") {
    throw {
      status: 400,
      message: "Cannot delete vehicle with active bookings",
    };
  }
  const activeBooking = await prisma.booking.findFirst({
    where: {
      vehicleId: id,
      status: "ACTIVE",
    },
  });

  if (activeBooking) {
    throw {
      status: 400,
      message: "Cannot delete vehicle with active bookings",
    };
  }

  await prisma.vehicle.delete({ where: { id } });
  return true;
}
