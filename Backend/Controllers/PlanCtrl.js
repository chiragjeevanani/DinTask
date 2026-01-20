import Plan from "../Models/PlanModel.js";
import razorpay from "../Config/razorpay.js";

export const createPlan = async (req, res) => {
  try {
    const { planName, planPrice, planType, planDetails, employeeLimit , planTier} = req.body;

    // Validate planType
    const period = planType.toLowerCase();
    if (!["daily", "weekly", "monthly", "yearly"].includes(period)) {
      return res.status(400).json({ success: false, message: "Invalid planType" });
    }

    // Convert planDetails array to string
    const description = Array.isArray(planDetails) ? planDetails.join(", ") : planDetails || "";

    let razorpayPlanId = null;

    // 👉 Only create Razorpay plan if price > 0
    if (planPrice > 0) {
      const razorpayPlan = await razorpay.plans.create({
        period,
        interval: 1,
        item: {
          name: `${planName} - ${planTier}`,
          amount: Math.round(planPrice * 100), // paise
          currency: "INR",
          description,
        },
      });

      razorpayPlanId = razorpayPlan.id;
    }

    // Save plan in DB
    const plan = await Plan.create({
      planName,
      planPrice,
      planType,
      planDetails,
      employeeLimit,
      planTier,
      razorpayPlanId, // null for free plan
    });

    res.status(201).json({
      success: true,
      message: planPrice > 0 ? "Paid plan created successfully" : "Free plan created successfully",
      plan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL PLANS =================
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isDeleted: false });
    res.status(200).json({ success: true,message: "Plans fetched successfully", plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE PLAN =================
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan || plan.isDeleted)
      return res.status(404).json({ success: false, message: "Plan not found" });

    res.status(200).json({ success: true, message: "Plan fetched successfully", plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planName, planPrice, planType, planDetails, employeeLimit, isActive } = req.body;

    const plan = await Plan.findById(id);
    if (!plan || plan.isDeleted) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    // Update DB fields
    plan.planName = planName ?? plan.planName;
    plan.planPrice = planPrice ?? plan.planPrice;
    plan.planType = planType ?? plan.planType;
    plan.planDetails = planDetails ?? plan.planDetails;
    plan.employeeLimit = employeeLimit ?? plan.employeeLimit;
    if (isActive !== undefined) plan.isActive = isActive;

    // ---------------- Razorpay Logic ----------------

    // Only handle Razorpay if price > 0
    if (plan.planPrice > 0) {
      const period = plan.planType.toLowerCase();
      if (!["daily", "weekly", "monthly", "yearly"].includes(period)) {
        return res.status(400).json({ success: false, message: "Invalid planType" });
      }

      const description = Array.isArray(plan.planDetails)
        ? plan.planDetails.join(", ")
        : plan.planDetails || "";

      // Razorpay does not support updating existing plan → create new one
      const razorpayPlan = await razorpay.plans.create({
        period,
        interval: 1,
        item: {
          name: plan.planName,
          amount: Math.round(plan.planPrice * 100),
          currency: "INR",
          description,
        },
      });

      plan.razorpayPlanId = razorpayPlan.id;
    }

    // If price is 0 → Free plan → remove razorpay plan id
    if (plan.planPrice == 0) {
      plan.razorpayPlanId = null;
    }

    await plan.save();

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE PLAN (soft delete) =================
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan || plan.isDeleted)
      return res.status(404).json({ success: false, message: "Plan not found" });

    plan.isDeleted = true;
    await plan.save();

    res.status(200).json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
