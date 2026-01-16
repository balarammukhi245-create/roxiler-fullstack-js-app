import express from "express";
import {
  getDashboardStats,
  addUser,
  addStore,
  listUsers,
  listStores,
  getUserDetails,
  getAdminRatings,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// All admin-only
router.use(verifyToken, allowRoles("admin"));

router.get("/dashboard", getDashboardStats);
router.post("/users", addUser);
router.post("/stores", addStore);
router.get("/users", listUsers);
router.get("/stores", listStores);
router.get("/users/:id", getUserDetails);
router.get("/stores/ratings", getAdminRatings);

export default router;
