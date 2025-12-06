import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/demoroute", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", authRoutes);

export default app;
