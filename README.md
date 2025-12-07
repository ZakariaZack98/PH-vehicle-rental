# 🚗 Vehicle Rental Management System

A production-ready vehicle rental backend API built with TypeScript, Express.js, and PostgreSQL. This system enables efficient management of vehicle fleets, customer bookings, and administrative operations with role-based access control.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development Guide](#development-guide)

---

## ✨ Features

### Core Functionality

- **Vehicle Management** - Add, update, delete, and track vehicle availability
- **User Management** - User registration, profile updates, and role-based permissions
- **Booking System** - Create, manage, and track vehicle rentals with automatic pricing
- **Authentication** - Secure JWT-based authentication with role separation
- **Smart Availability** - Real-time vehicle status tracking prevents double-bookings

### Admin Capabilities

- View and manage all users in the system
- Full vehicle fleet management
- Oversight of all bookings and rental history
- Mark vehicles as returned and update statuses

### Customer Features

- Self-service registration and login
- Browse available vehicles
- Create and manage own bookings
- Cancel bookings before rental start date
- View booking history

---

## 🛠 Tech Stack

| Component     | Technology     | Purpose                           |
| ------------- | -------------- | --------------------------------- |
| **Runtime**   | Node.js        | Server runtime                    |
| **Language**  | TypeScript     | Type-safe development             |
| **Framework** | Express.js 5.x | Web server & routing              |
| **Database**  | PostgreSQL     | Data persistence                  |
| **ORM**       | Prisma         | Database abstraction & migrations |
| **Auth**      | JWT + bcrypt   | Secure authentication             |
| **Utilities** | CORS, dotenv   | Middleware & config               |

---

## 🏗 Project Structure

```
src/
├── app.ts                          # Express app initialization & middleware setup
├── server.ts                       # Server startup entry point
│
├── config/
│   └── prisma.ts                  # Prisma client singleton
│
├── middlewares/
│   ├── auth.ts                    # JWT verification & token parsing
│   ├── role.ts                    # Role-based authorization checks
│   └── errorHandler.ts            # Global error response handler
│
└── modules/                        # Feature modules (modular architecture)
    │
    ├── auth/                       # Authentication module
    │   ├── auth.routes.ts         # Signup/signin endpoints
    │   ├── auth.controller.ts     # Request handling & validation
    │   └── auth.service.ts        # Business logic & DB operations
    │
    ├── users/                      # User management module
    │   ├── users.routes.ts        # User endpoints
    │   ├── users.controller.ts    # Request/response handling
    │   └── users.service.ts       # User operations
    │
    ├── vehicles/                   # Vehicle fleet module
    │   ├── vehicles.routes.ts     # Vehicle CRUD endpoints
    │   ├── vehicles.controller.ts # Response formatting & validation
    │   └── vehicles.service.ts    # Vehicle business logic
    │
    └── bookings/                   # Booking system module
        ├── bookings.routes.ts     # Booking endpoints
        ├── bookings.controller.ts # Booking handlers & formatting
        └── bookings.service.ts    # Booking logic & calculations
```

### Architecture Pattern: **3-Layer Architecture**

Each module follows a clean separation:

- **Routes** - HTTP endpoint definitions & middleware composition
- **Controllers** - Request parsing, validation, response formatting
- **Services** - Core business logic, database queries, calculations

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** 16.0 or higher
- **PostgreSQL** 12.0 or higher
- **npm** or **yarn** package manager

### Quick Start

1. **Clone & install dependencies**

```bash
git clone <repository-url>
cd PH-Vehicle-Rental
npm install
```

2. **Configure environment**

```bash
# Create .env file with database and server config
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_rental
# JWT_SECRET=your-secure-random-secret-key
# PORT=4000
```

3. **Initialize database**

```bash
npm run prisma migrate dev
```

4. **Start development server**

```bash
npm run dev
```

Server available at: `http://localhost:4000`

---

## 📡 API Documentation

### Base URL

```
http://localhost:4000/api/v1
```

### Authentication Header

```
Authorization: Bearer <jwt_token>
```

---

### 🔐 Authentication Endpoints

#### Sign Up

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "0171234567",
  "role": "customer"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0171234567",
    "role": "customer"
  }
}
```

#### Sign In

```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

---

### 🚗 Vehicle Endpoints

#### Create Vehicle (Admin)

```http
POST /vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Honda Civic 2024",
  "type": "car",
  "registration_number": "PK-2024-001",
  "daily_rent_price": 3500,
  "availability_status": "available"
}
```

#### Get All Vehicles

```http
GET /vehicles
```

#### Get Vehicle Details

```http
GET /vehicles/1
```

#### Update Vehicle (Admin)

```http
PUT /vehicles/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "daily_rent_price": 4000,
  "availability_status": "available"
}
```

#### Delete Vehicle (Admin)

```http
DELETE /vehicles/1
Authorization: Bearer <admin_token>
```

---

### 👥 User Endpoints

#### List All Users (Admin)

```http
GET /users
Authorization: Bearer <admin_token>
```

#### Get User Profile

```http
GET /users/1
Authorization: Bearer <token>
```

#### Update User Profile

```http
PUT /users/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "0301234567"
}
```

#### Delete User (Admin)

```http
DELETE /users/1
Authorization: Bearer <admin_token>
```

---

### 📅 Booking Endpoints

#### Create Booking (Customer/Admin)

```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": 1,
  "rent_start_date": "2025-12-20",
  "rent_end_date": "2025-12-25"
}
```

**Auto-calculated on creation:**

- Duration: `(25 - 20) = 5 days`
- Total price: `5 × 3500 = 17,500`
- Vehicle status: Updates to BOOKED

#### View Bookings

```http
GET /bookings
Authorization: Bearer <token>

# Admin: See all bookings
# Customer: See only own bookings
```

#### Cancel Booking (Customer/Admin)

```http
PUT /bookings/1
Authorization: Bearer <token>
Content-Type: application/json

{"status": "cancelled"}
```

**Requirements:**

- Current date must be before rental start date
- Vehicle returns to AVAILABLE

#### Mark as Returned (Admin)

```http
PUT /bookings/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{"status": "returned"}
```

---

## 🗄 Database Schema

### Users Table

```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  role ENUM('ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP
)
```

### Vehicles Table

```sql
CREATE TABLE "Vehicle" (
  id SERIAL PRIMARY KEY,
  vehicle_name TEXT NOT NULL,
  type ENUM('CAR', 'BIKE', 'VAN', 'SUV') NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  daily_rent_price FLOAT NOT NULL,
  availability_status ENUM('AVAILABLE', 'BOOKED') DEFAULT 'AVAILABLE',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP
)
```

### Bookings Table

```sql
CREATE TABLE "Booking" (
  id SERIAL PRIMARY KEY,
  customerId INT NOT NULL REFERENCES "User"(id),
  vehicleId INT NOT NULL REFERENCES "Vehicle"(id),
  rent_start_date TIMESTAMP NOT NULL,
  rent_end_date TIMESTAMP NOT NULL,
  total_price FLOAT NOT NULL,
  status ENUM('ACTIVE', 'CANCELLED', 'RETURNED') DEFAULT 'ACTIVE',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP
)
```

---

## 🔒 Security Implementation

### Authentication

- **JWT Tokens** - Stateless, expiring authentication
- **Password Hashing** - bcrypt with configurable salt rounds
- **Token Validation** - Verified on every protected endpoint

### Authorization

- **Role-Based Access Control (RBAC)**
  - `ADMIN` - Full system access
  - `CUSTOMER` - Limited to own data
- **Endpoint Protection**
  - Public: `/auth/*`, `GET /vehicles`
  - Authenticated: Most operations
  - Admin-only: Management endpoints

### Data Protection

- Input validation on all endpoints
- Unique constraints on email, registration_number
- Foreign key constraints prevent orphaned data
- Safe error responses (no sensitive data leakage)

---

## 🛠 Development Guide

### Running Tests

```bash
npm test
```

### Database Migrations

```bash
# View pending migrations
npm run prisma migrate status

# Create migration after schema change
npm run prisma migrate dev --name <description>

# Reset database (dev only!)
npm run prisma migrate reset
```

### Adding a New Feature

1. **Create module structure**

```bash
mkdir -p src/modules/featurename
touch src/modules/featurename/{featurename.routes.ts,featurename.controller.ts,featurename.service.ts}
```

2. **Update Prisma schema** (if needed)

```bash
# Edit prisma/schema.prisma
npm run prisma migrate dev --name add_feature
```

3. **Implement layers**

   - Routes: Define endpoints
   - Controller: Handle requests
   - Service: Implement logic

4. **Register in app.ts**

```typescript
import featureRoutes from "./modules/featurename/featurename.routes";
app.use("/api/v1/featurename", featureRoutes);
```

### Code Style

- **TypeScript** for type safety
- **Async/await** for asynchronous operations
- **Snake_case** for database field names
- **Lowercase enums** in API responses
- **Descriptive function names** following module conventions

---

## 📊 Response Format

All API responses follow a consistent structure:

**Success Response**

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    /* response object or array */
  }
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical error details"
}
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Error monitoring setup

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=<production-db-url>
JWT_SECRET=<strong-random-secret>
PORT=4000
```

---

## 🐛 Common Issues & Solutions

| Issue                     | Solution                                                      |
| ------------------------- | ------------------------------------------------------------- |
| Database connection fails | Verify PostgreSQL is running and `DATABASE_URL` is correct    |
| Invalid JWT token         | Ensure token is in `Authorization: Bearer <token>` header     |
| Booking creation fails    | Check vehicle exists, is available, and end_date > start_date |
| Port 4000 in use          | Change `PORT` in `.env` or kill process on port 4000          |
| Password hashing slow     | Check `SALT_ROUNDS` in auth service (default: 10)             |

---

## 📝 License

Educational assignment project. 2025.

---

## 📞 Support & Documentation

For detailed request/response examples, refer to the inline JSDoc comments in service files.

For issues with Prisma, visit: https://www.prisma.io/docs/
