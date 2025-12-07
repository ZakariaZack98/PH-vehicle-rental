import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import vehicleRoutes from "./modules/vehicles/vehicles.routes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/demoroute", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);

// Global error handler (should be the last middleware)
app.use(errorHandler);

export default app;
