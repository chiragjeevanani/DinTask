import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    razorpayPlanId: {
      type: String,
      // required: true,
    },

    planPrice: {
      type: Number,
      required: true,
    },

    planType: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },

    planTier: {
      type: String,
      enum: ["starter", "pro", "business"],
      required: true,
    },


    planDetails: {
      type: [String], // array of features / benefits
      default: [],
    },

    employeeLimit: {
      type: Number,
      default: 1,
      required: true,
    },
    managerLimit: {
      type: Number,
      default: 1,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
