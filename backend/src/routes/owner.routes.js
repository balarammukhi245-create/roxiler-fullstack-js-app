import express from "express";
import { getOwnerDashboard } from "../controllers/owner.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Only store owners
router.get("/dashboard", verifyToken, allowRoles("owner"), getOwnerDashboard);

export default router;
