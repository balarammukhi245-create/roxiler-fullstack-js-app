import express from "express";
import {
  getAllStores,
  submitRating,
  updatePassword
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Only normal users
router.use(verifyToken, allowRoles("user"));

router.get("/stores", getAllStores);
router.post("/rating", submitRating);
router.put("/update-password", updatePassword);

export default router;
