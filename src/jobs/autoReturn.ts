import { prisma } from "../config/prisma";
import { BookingStatus, AvailabilityStatus } from "@prisma/client";

//** function that iterates through the due bookings and returns the vehicle make it available automatically if the booking period is over
export async function autoReturn() {
  const now = new Date();

  const overdueBookings = await prisma.booking.findMany({
    where: {
      status: BookingStatus.ACTIVE,
      rent_end_date: {
        lt: now,
      },
    },
  });

  for (const booking of overdueBookings) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.RETURNED },
    });

    await prisma.vehicle.update({
      where: { id: booking.vehicleId },
      data: { availability_status: AvailabilityStatus.AVAILABLE },
    });
  }
}
