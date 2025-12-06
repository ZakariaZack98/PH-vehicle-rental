import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const TOKEN_EXPIRES_IN = "24h";

type RoleInput = "admin" | "customer";

/**
 * Signup service.
 * 
 * Creates a new user with the given payload and returns the user in the shape
 * of the API reference.
 * 
 * @throws {Object} - error response with status and message
 * @throws {Object} - error response with status 400 and message "Missing required fields" if any of the required fields are missing
 * @throws {Object} - error response with status 400 and message "Email already registered" if the email is already registered
 * 
 * @param {Object} payload - signup payload with name, email, password, phone and optional role
 * @returns {Promise<Object>} - promise resolving to the created user in the shape of the API reference
 */
export async function signupService(payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: RoleInput;
}) {
  const { name, email, password, phone, role } = payload;

  //TODO: throw error if any field is missig
  if (!name || !email || !password || !phone) {
    throw { status: 400, message: "Missing required fields" };
  }

  //TODO: check user with provided email allready exists or not
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw { status: 400, message: "Email already registered" };
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const dbRole = role === "admin" ? "ADMIN" : "CUSTOMER";

  //TODO: creating the user in db
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone,
      role: dbRole,
    },
  });

  //TODO: returning shape per API referencee
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role.toLowerCase(),
  };
}

/**
 * Signin service.
 * 
 * Authenticates a user with the given email and password and returns a valid JWT token
 * and the user information in the shape of the API reference.
 * 
 * @throws {Object} - error response with status and message
 * @throws {Object} - error response with status 400 and message "Missing required fields" if any of the required fields are missing
 * @throws {Object} - error response with status 401 and message "Invalid credentials" if the email or password is invalid
 * 
 * @param {Object} payload - signin payload with email and password
 * @returns {Promise<Object>} - promise resolving to the JWT token and the user information in the shape of the API reference
 */
export async function signinService(payload: { email: string; password: string }) {
  const { email, password } = payload;

  //TODO: throw early error if email or password is missing
  if (!email || !password) {
    throw { status: 400, message: "Missing required fields" };
  }

  //TODO: find the user from db, if not found or cred invalid- throw errorr
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
  
  //TODO: returning shape per API referencee
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.toLowerCase(),
    },
  };
}
