import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { updateOwnerPassword, getOwnerDashboard } from "../controllers/owner.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, allowRoles("owner"), getOwnerDashboard);
router.put("/update-password", verifyToken, allowRoles("owner"), updateOwnerPassword);

export default router;
