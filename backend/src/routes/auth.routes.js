import express from "express";
import { signup, login, updatePassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter,login);
router.patch("/update-password", verifyToken, updatePassword);

export default router;
