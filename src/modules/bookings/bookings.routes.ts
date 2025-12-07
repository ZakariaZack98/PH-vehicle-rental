import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";

import {
  createBooking,
  getBookings,
  returnVehicle,
} from "./bookings.controller";

const router = Router();

router.post("/", authenticate, authorize(["CUSTOMER", "ADMIN"]), createBooking);
router.get("/", authenticate, getBookings);
// Update booking status (e.g., cancel or mark returned) — parameter name follows API reference
router.put("/:bookingId", authenticate, returnVehicle);

export default router;
