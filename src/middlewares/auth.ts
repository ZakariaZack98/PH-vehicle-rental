import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secrate";

export interface AuthPayload {
  userId: number;
  role: "ADMIN" | "CUSTOMER";
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

/**
 ** Middleware to authenticate incoming requests.
 * 
 * It expects a valid JWT token in the Authorization header.
 * If the token is missing or invalid, it returns a 401 response.
 * If the token is valid, it adds the user information to the request object and calls the next middleware.
 * 
 * @param {AuthRequest} req The incoming request.
 * @param {Response} res The response object.
 * @param {NextFunction} next The next middleware to call.
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    //TODO: see if bearer token came with request, thriow error if not
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authentication token",
      });
    }

    //TODO: Extract the token abd set the payload
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid authentication token",
    });
  }
}
