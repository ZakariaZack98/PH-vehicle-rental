import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

/**
 ** Signup endpoint.
 * 
 * Creates a new user with the given payload and returns the user in the shape
 * of the API reference.
 * 
 * @throws {Object} - error response with status and message
 * @throws {Object} - error response with status 400 and message "Missing required fields" if any of the required fields are missing
 * @throws {Object} - error response with status 400 and message "Email already registered" if the email is already registered
 * 
 * @param {Request} req - incoming request
 * @param {Response} res - response object
 * @param {NextFunction} next - next middleware to call
 */
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body;
    const user = await authService.signupService(payload);
    return res.status(201).json({
      success: true,
      message: "User registerd successfully",
      data: user,
    });
  } catch (err: any) {
    return next(err);
  }
}

/**
 ** Signin endpoint.
 * 
 * Authenticates a user with the given email and password and returns a valid JWT token
 * and the user information in the shape of the API reference.
 * 
 * @throws {Object} - error response with status and message
 * @throws {Object} - error response with status 400 and message "Missing required fields" if any of the required fields are missing
 * @throws {Object} - error response with status 401 and message "Invalid credentials" if the email or password is invalid
 * 
 * @param {Request} req - incoming request
 * @param {Response} res - response object
 * @param {NextFunction} next - next middleware to call
 */
export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.signinService({ email, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err: any) {
    return next(err);
  }
}
