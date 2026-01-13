import express from "express";
import {
  getDashboardStats,
  addUser,
  addStore,
  listUsers,
  listStores
} from "../controllers/admin.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// All routes below are admin-only
router.get("/dashboard", verifyToken, allowRoles("admin"), getDashboardStats);
router.post("/users", verifyToken, allowRoles("admin"), addUser);
router.post("/stores", verifyToken, allowRoles("admin"), addStore);
router.get("/users", verifyToken, allowRoles("admin"), listUsers);
router.get("/stores", verifyToken, allowRoles("admin"), listStores);

export default router;
