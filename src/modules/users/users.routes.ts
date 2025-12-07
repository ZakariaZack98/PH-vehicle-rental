import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";

import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "./users.controller";

const router = Router();

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getSingleUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteUser);

export default router;
