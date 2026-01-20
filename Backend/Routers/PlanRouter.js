import express from "express";
import {
    createPlan,
    getPlans,
    getPlanById,
    updatePlan,
    deletePlan,
} from "../Controllers/PlanCtrl.js";

const router = express.Router();

import { AuthMiddleware, isSuperAdmin } from "../Middlewares/AuthMiddleware.js";

// Create Plan
router.post("/createPlan", createPlan);

// Get All Plans
router.get("/getPlans", getPlans);

// Get Single Plan
router.get("/getPlanById/:id", getPlanById);

// Update Plan
router.put("/editPlan/:id", updatePlan);

// Delete Plan (Soft Delete)
router.delete("/deletePlan/:id", deletePlan);

export default router;
