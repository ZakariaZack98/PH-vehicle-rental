import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

/**
 ** Middleware to authorize incoming requests.
 * 
 * It checks if the user is authenticated and has a role that is included in the given array.
 * If the user is not authenticated or does not have the required role, it returns a 401 or 403 response respectively.
 * If the user is authorized, it calls the next middleware.
 * 
 * @param {("ADMIN" | "CUSTOMER")[]} roles - array of allowed roles
 * @returns {(req: AuthRequest, res: Response, next: NextFunction) => void} - middleware to authorize incoming requests
 */
export function authorize(roles: ("ADMIN" | "CUSTOMER")[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authentication token",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
}
