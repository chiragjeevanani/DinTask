import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getManagerEvents,
  getEmployeeEvents,
} from "../Controllers/EvenetCtrl.js";

const router = express.Router();

import { AdminMiddleware, isAdmin } from "../Middlewares/AdminMiddleware.js";
import { ManagerMiddleware, isManager } from "../Middlewares/ManagerMiddleware.js";
import { EmployeeMiddleware,isEmployee } from "../Middlewares/EmployeeMiddleware.js";


router.post("/createEvent", AdminMiddleware, isAdmin, createEvent);
router.put("/updateEvent/:id", AdminMiddleware, isAdmin, updateEvent);
router.delete("/deleteEvent/:id", AdminMiddleware, isAdmin, deleteEvent);
router.get("/getEventById/:id", AdminMiddleware, isAdmin, getEventById);
router.get("/getEvents", AdminMiddleware, isAdmin, getEvents);   // ?type=today | week | month
router.get("/getManagerEvents", ManagerMiddleware, isManager , getManagerEvents);   // ?type=today | week | month
router.get("/getEmployeeEvents", EmployeeMiddleware, isEmployee , getEmployeeEvents);   // ?type=today | week | month

export default router;
