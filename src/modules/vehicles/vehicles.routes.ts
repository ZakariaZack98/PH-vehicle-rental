import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";

import {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicles.controller";

const router = Router();

router.post("/", authenticate, authorize(["ADMIN"]), createVehicle);

router.get("/", getAllVehicles);
router.get("/:vehicleId", getSingleVehicle);

router.put("/:vehicleId", authenticate, authorize(["ADMIN"]), updateVehicle);
router.delete("/:vehicleId", authenticate, authorize(["ADMIN"]), deleteVehicle);

export default router;
