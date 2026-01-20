import express from "express";
import {
  createSubscription,
  getSubscriptionByAdmin,
  getAllSubscriptions,
  cancelSubscription
} from "../Controllers/SubscriptionCtrl.js";

const router = express.Router();
import { AdminMiddleware, isAdmin } from "../Middlewares/AdminMiddleware.js";
// Create a subscription
router.post("/createSubscription", AdminMiddleware, isAdmin, createSubscription);

// Get subscription by admin
router.get("/getSubscriptionByAdmin",AdminMiddleware, isAdmin, getSubscriptionByAdmin);

// Get all subscriptions
router.get("/getAllSubscriptions", getAllSubscriptions);

// Cancel subscription
router.patch("/cancelSubscription/:subscriptionId",AdminMiddleware, isAdmin, cancelSubscription);

export default router;
