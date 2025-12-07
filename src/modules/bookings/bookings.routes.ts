import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";

import {
  createBooking,
  getBookings,
  returnVehicle,
} from "./bookings.controller";

const router = Router();

router.post("/", authenticate, authorize(["CUSTOMER"]), createBooking);
router.get("/", authenticate, getBookings);
router.put("/:id/return", authenticate, authorize(["ADMIN"]), returnVehicle);

export default router;
