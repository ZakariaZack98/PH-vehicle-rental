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
router.get("/:id", getSingleVehicle);

router.put("/:id", authenticate, authorize(["ADMIN"]), updateVehicle);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteVehicle);

export default router;
