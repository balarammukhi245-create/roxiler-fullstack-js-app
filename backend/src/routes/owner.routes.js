import express from "express";
import { getOwnerDashboard } from "../controllers/owner.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
console.log("Owner routes loaded");
const router = express.Router();

// Only store owners
router.get("/dashboard", verifyToken, allowRoles("owner"), getOwnerDashboard);



export default router;
