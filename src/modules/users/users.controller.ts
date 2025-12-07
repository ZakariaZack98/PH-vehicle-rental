import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth";
import * as usersService from "./users.service";

export async function getAllUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await usersService.getUsers(req.user!);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSingleUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.userId);
    const user = await usersService.getUserById(id, req.user!);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.userId);
    const updated = await usersService.updateUser(id, req.body, req.user!);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.userId);
    await usersService.deleteUser(id, req.user!);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
