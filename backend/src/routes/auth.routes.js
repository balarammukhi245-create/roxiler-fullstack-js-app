import express from "express";
import { signup, login, updatePassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/update-password", verifyToken, updatePassword);

export default router;
