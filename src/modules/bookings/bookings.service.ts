import { prisma } from "../../config/prisma";
import { BookingStatus, AvailabilityStatus } from "@prisma/client";

/**
 ** Creates a new booking with the given data
 *
 * @throws {Object} - error response with status 400 and message "Invalid rental date range" if the rental date range is invalid
 * @throws {Object} - error response with status 404 and message "Vehicle not found" if the vehicle with the given id does not exist
 * @throws {Object} - error response with status 400 and message "Vehicle is already booked" if the vehicle is already booked
 * @throws {Object} - error response with status 400 and message "Vehicle already booked for selected dates" if the vehicle is already booked for the selected dates
 * @param {number} customerId - customer id
 * @param {{ vehicleId: number, rent_start_date: string, rent_end_date: string }} data - booking data to create with keys vehicleId, rent_start_date and rent_end_date
 * @returns {Promise<Object>} - promise resolving to the created booking object in the shape of the API reference
 */
export async function createBooking(
  customerId: number,
  data: {
    vehicleId: number;
    rent_start_date: string;
    rent_end_date: string;
  }
) {
  const { vehicleId, rent_start_date, rent_end_date } = data;

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw { status: 400, message: "Invalid rental date range" };
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    throw { status: 404, message: "Vehicle not found" };
  }

  if (vehicle.availability_status === "BOOKED") {
    throw { status: 400, message: "Vehicle is already booked" };
  }

  const overlap = await prisma.booking.findFirst({
    where: {
      vehicleId,
      status: "ACTIVE",
      OR: [
        {
          rent_start_date: { lte: endDate },
          rent_end_date: { gte: startDate },
        },
      ],
    },
  });

  if (overlap) {
    throw { status: 400, message: "Vehicle already booked for selected dates" };
  }

  //TODO: calculate total price
  const diffDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const total_price = Math.ceil(diffDays) * Number(vehicle.daily_rent_price);

  const booking = await prisma.booking.create({
    data: {
      customerId,
      vehicleId,
      rent_start_date: startDate,
      rent_end_date: endDate,
      total_price,
      status: BookingStatus.ACTIVE,
    },
  });

  //TODO: mark vehicle as booked
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { availability_status: AvailabilityStatus.BOOKED },
  });

  return booking;
}


/**
 ** Retrieves all bookings if the current user is an admin, or retrieves all bookings for the current user if they are not an admin.
 * 
 * @param {Object} currentUser - current user object with userId and role
 * @returns {Promise<Object[]>} - promise resolving to an array of booking objects in the shape of the API reference
 */
export async function getBookings(currentUser: {
  userId: number;
  role: string;
}) {
  if (currentUser.role === "ADMIN") {
    return prisma.booking.findMany({
      include: { customer: true, vehicle: true },
    });
  }

  return prisma.booking.findMany({
    where: { customerId: currentUser.userId },
    include: { vehicle: true },
  });
}


/**
 ** Returns a vehicle by marking its booking as returned and updating its availability status to available.
 * 
 * @throws {Object} - error response with status 404 and message "Booking not found" if the booking with the given id does not exist
 * @param {number} id - booking id
 * @returns {Promise<Object>} - promise resolving to the updated booking object in the shape of the API reference
 */
export async function returnVehicle(id: number) {
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    throw { status: 404, message: "Booking not found" };
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: BookingStatus.RETURNED,
    },
  });

  await prisma.vehicle.update({
    where: { id: booking.vehicleId },
    data: { availability_status: AvailabilityStatus.AVAILABLE },
  });

  return updated;
}
