import express from "express";
import { getAllStores, submitRating } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Only normal users
router.get("/stores", verifyToken, allowRoles("user"), getAllStores);
router.post("/rate", verifyToken, allowRoles("user"), submitRating);

export default router;
