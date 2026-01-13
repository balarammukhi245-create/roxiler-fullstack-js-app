import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./models/initDB.js"; 
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import ownerRoutes from "./routes/owner.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB
initDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
  res.send("Roxiler Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend connected successfully 🎉" });
});


export default app;
