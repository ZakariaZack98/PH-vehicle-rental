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

router.get("/", authenticate, authorize(["ADMIN"]), getAllUsers);
router.get("/:userId", authenticate, getSingleUser);
router.put("/:userId", authenticate, updateUser);
router.delete("/:userId", authenticate, authorize(["ADMIN"]), deleteUser);

export default router;
