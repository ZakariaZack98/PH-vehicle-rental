import { prisma } from "../../config/prisma";

/**
 ** Retrieves all users if the current user is an admin, or retrieves the current user if they are not an admin.
 * 
 * @param {Object} currentUser - current user object with userId and role
 * @returns {Promise<Object[]>} - promise resolving to an array of user objects in the shape of the API reference
 */
export async function getUsers(currentUser: { userId: number; role: string }) {
  if (currentUser.role === "ADMIN") {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return users.map((u) => ({ ...u, role: u.role.toLowerCase() }));
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return user ? [{ ...user, role: user.role.toLowerCase() }] : [];
}

/**
 ** Retrieves a user by their id if the current user is an admin, or retrieves the current user if they are not an admin.
 * 
 * @throws {Object} - error response with status 403 and message "You are not authorized to perform this action" if the current user is not an admin and the user id does not match the current user's id
 * @throws {Object} - error response with status 404 and message "User not found" if the user with the given id does not exist
 * 
 * @param {number} id - user id
 * @param {Object} currentUser - current user object with userId and role
 * @returns {Promise<Object>} - promise resolving to the user object in the shape of the API reference
 */
export async function getUserById(
  id: number,
  currentUser: { userId: number; role: string }
) {
  if (currentUser.role !== "ADMIN" && currentUser.userId !== id) {
    throw { status: 403, message: "You are not authorized to perform this action" };
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return { ...user, role: user.role.toLowerCase() };
}

/**
 ** Updates a user by their id if the current user is an admin, or updates the current user if they are not an admin.
 * 
 * @throws {Object} - error response with status 403 and message "You are not authorized to perform this action" if the current user is not an admin and the user id does not match the current user's id
 * @throws {Object} - error response with status 404 and message "User not found" if the user with the given id does not exist
 * 
 * @param {number} id - user id
 * @param {Object} data - user data to update with keys name and phone
 * @param {Object} currentUser - current user object with userId and role
 * @returns {Promise<Object>} - promise resolving to the updated user object in the shape of the API reference
 */
export async function updateUser(
  id: number,
  data: { name?: string; phone?: string },
  currentUser: { userId: number; role: string }
) {
  if (currentUser.role !== "ADMIN" && currentUser.userId !== id) {
    throw { status: 403, message: "You are not authorized to perform this action" };
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return { ...user, role: user.role.toLowerCase() };
}

/**
 ** Deletes a user by their id if the current user is an admin.
 * 
 * Throws an error with status 403 and message "You are not authorized to perform this action" if the current user is not an admin.
 * Throws an error with status 400 and message "Cannot delete user with active bookings" if the user with the given id has active bookings.
 * 
 * @param {number} id - user id
 * @param {Object} currentUser - current user object with userId and role
 * @returns {Promise<boolean>} - promise resolving to true if the user is deleted successfully
 */
export async function deleteUser(
  id: number,
  currentUser: { userId: number; role: string }
) {
  if (currentUser.role !== "ADMIN") {
    throw { status: 403, message: "You are not authorized to perform this action" };
  }

  const activeBooking = await prisma.booking.findFirst({
    where: {
      customerId: id,
      status: "ACTIVE",
    },
  });

  if (activeBooking) {
    throw {
      status: 400,
      message: "Cannot delete user with active bookings",
    };
  }

  await prisma.user.delete({ where: { id } });

  return true;
}
