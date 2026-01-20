import SuperAdmin from "../Models/AuthModel.js";
import Admin from "../Models/AdminModel.js";
import { generateToken } from "../Helpers/generateToken.js"
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../Cloudinary/CloudinaryHelper.js"
import Subscription from "../Models/SubscriptionModel.js";
import Task from "../Models/TaskModel.js";
import Manager from "../Models/ManagerModel.js";
import Employee from "../Models/EmployeeModel.js";

// ================= LOGIN SUPER ADMIN =================
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "SuperAdmin not found",
        data: null
      });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null
      });
    }

    const token = await generateToken(superAdmin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: superAdmin,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { ownerName, email, companyName, password } = req.body;

    const existing = await Admin.findOne({ email, isDeleted: false });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists", data: null });

    const admin = await Admin.create({ ownerName, email, companyName, password });

    res.status(201).json({ success: true, message: "Admin created successfully", data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= GET ALL ADMINS =================
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isDeleted: false });

    // 🔹 Fetch active subscription for each admin
    const adminsWithSubscription = await Promise.all(
      admins.map(async (admin) => {
        const activeSub = await Subscription.findOne({
          adminId: admin._id,
          status: "active",
          isDeleted: false,
        }).populate("planId");

        return {
          ...admin.toObject(),
          activeSubscription: activeSub || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      data: adminsWithSubscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= GET SINGLE ADMIN =================
export const getSingleAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findOne({ _id: id, isDeleted: false });
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found", data: null });

    // 🔹 Fetch active subscription
    const activeSub = await Subscription.findOne({
      adminId: admin._id,
      status: "active",
      isDeleted: false,
    }).populate("planId");

    res.status(200).json({
      success: true,
      message: "Admin fetched successfully",
      data: {
        ...admin.toObject(),
        activeSubscription: activeSub || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= UPDATE ADMIN =================
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { ownerName, email, companyName } = req.body;

    const admin = await Admin.findById(id, { isDeleted: false });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found", data: null });

    admin.ownerName = ownerName ?? admin.ownerName;
    admin.email = email ?? admin.email;
    admin.companyName = companyName ?? admin.companyName;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "admin_avatars"
      );
      admin.avatar = uploadResult.url;
    }
    await admin.save();
    res.status(200).json({ success: true, message: "Admin updated successfully", data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= DELETE ADMIN (Soft Delete) =================
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id, { isDeleted: false });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found", data: null });

    admin.isDeleted = true;
    await admin.save();

    res.status(200).json({ success: true, message: "Admin deleted successfully", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= CHANGE STATUS =================
export const changeAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const admin = await Admin.findById(id, { isDeleted: false });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found", data: null });

    admin.status = status ?? admin.status;
    await admin.save();

    res.status(200).json({ success: true, message: "Admin status updated", data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= LOGIN ADMIN =================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, isDeleted: false });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found", data: null });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials", data: null });

    const token = generateToken(admin._id);

    res.status(200).json({ success: true, message: "Login successful", data: admin, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Old password incorrect", data: null });

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: "Password changed successfully", data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", data: null });
  }
};


export const adminReports = async (req, res) => {
  try {
    const { userId, filterType } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
        data: null
      });
    }

    // Date filter
    let startDate = new Date();

    if (filterType === "last7days") {
      startDate.setDate(startDate.getDate() - 7);
    } 
    else if (filterType === "last30days") {
      startDate.setDate(startDate.getDate() - 30);
    } 
    else if (filterType === "thisYear") {
      startDate = new Date(new Date().getFullYear(), 0, 1);
    }

    // Check user role
    const manager = await Manager.findById(userId);
    const employee = await Employee.findById(userId);

    if (!manager && !employee) {
      return res.status(404).json({
        success: false,
        message: "User not found in manager or employee",
        data: null
      });
    }

    let filter = {
      isDeleted: false,
      createdAt: { $gte: startDate }
    };

    // Agar employee hai
    if (employee) {
      filter.assignEmployees = userId;
    }

    // Agar manager hai
    if (manager) {
      filter.assignManagerId = userId;
    }

    const totalTasks = await Task.countDocuments(filter);

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed"
    });

    const pendingTasks = totalTasks - completedTasks;

    const completionRate =
      totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      message: "User Task Report Generated Successfully",
      role: manager ? "manager" : "employee",
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: `${completionRate}%`
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};
