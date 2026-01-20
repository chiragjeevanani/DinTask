import express from "express";
import {
  loginSuperAdmin,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changeAdminStatus,
  loginAdmin,
  getSingleAdmin,
  changePassword,
  adminReports,
} from "../Controllers/AuthCtrl.js";

const router = express.Router();
import { AdminMiddleware, isAdmin } from "../Middlewares/AdminMiddleware.js";
import upload from "../Cloudinary/Upload.js";

// Login SuperAdmin
router.post("/login", loginSuperAdmin);

router.post("/createAdmin", createAdmin);
router.get("/getAllAdmins", getAllAdmins);
router.get("/getAdminById/:id", getSingleAdmin);
router.put("/editAdmin/:id", upload.single("avatar"), updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

// Status
router.patch("/changeAdminStatus/:id", changeAdminStatus);

// Auth
router.post("/loginAdmin", loginAdmin);
router.post("/changePassword", AdminMiddleware, isAdmin, changePassword);
router.get("/adminReports", AdminMiddleware, isAdmin, adminReports);

export default router;
