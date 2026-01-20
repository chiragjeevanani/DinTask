import express from "express";
import {
  getAdminDashboard,
  getSuperadminDashboard,
  managerDashboard,
} from "../Controllers/DashboardCtrl.js";

import { AdminMiddleware, isAdmin } from "../Middlewares/AdminMiddleware.js";
import {
  ManagerMiddleware,
  isManager,
} from "../Middlewares/ManagerMiddleware.js";

const router = express.Router();

router.get("/admin", AdminMiddleware, isAdmin, getAdminDashboard);
router.get("/superadmin", getSuperadminDashboard);
router.get("/manager", ManagerMiddleware, isManager, managerDashboard);

export default router;
