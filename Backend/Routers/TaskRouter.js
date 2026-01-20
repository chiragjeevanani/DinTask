import express from "express";
import {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
  getEmployeeTasks,
  getManagerTasks,
  getManagerAllTasks
} from "../Controllers/TaskCtrl.js";

import { AdminMiddleware, isAdmin } from "../Middlewares/AdminMiddleware.js";
import { EmployeeMiddleware, isEmployee } from "../Middlewares/EmployeeMiddleware.js";
import { ManagerMiddleware, isManager } from "../Middlewares/ManagerMiddleware.js";

const router = express.Router();

// Manager Routes
router.post("/createTask", AdminMiddleware, isAdmin, createTask);
router.get("/getAllTasks", AdminMiddleware, isAdmin, getAllTasks);
router.get("/getSingleTask/:id", AdminMiddleware, isAdmin, getSingleTask);
router.put("/editTask/:id", AdminMiddleware, isAdmin, updateTask);
router.delete("/deleteTask/:id", AdminMiddleware, isAdmin, deleteTask);
router.patch("/changeTaskStatus/:id", AdminMiddleware, isAdmin, changeTaskStatus);
router.get("/employeeTasks", EmployeeMiddleware, isEmployee, getEmployeeTasks);
router.get("/managerTasks", ManagerMiddleware, isManager, getManagerTasks);
router.get("/managerAllTasks", ManagerMiddleware, isManager, getManagerAllTasks);

export default router;
