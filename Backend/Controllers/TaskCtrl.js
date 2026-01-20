import Task from "../Models/TaskModel.js";
import Employee from "../Models/EmployeeModel.js";


// ================= CREATE TASK =================
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignEmployees ,assignManagerId} = req.body;
    const { id } = req.user; // manager id

    if (!assignEmployees || assignEmployees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please assign at least one employee",
        data: null,
      });
    }

    // verify employees exist
    const employees = await Employee.find({
      _id: { $in: assignEmployees },
      isDeleted: false,
      isActive: true,
    });

    if (employees.length !== assignEmployees.length) {
      return res.status(400).json({
        success: false,
        message: "One or more employees are invalid",
        data: null,
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assignEmployees,
      assignManagerId ,
      adminId: id,
    }); 

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= GET ALL TASKS (MANAGER) =================
export const getAllTasks = async (req, res) => {
  try {
    const { id } = req.user; // admin id

    const tasks = await Task.find({
      adminId: id,
      isDeleted: false,
    })
      .populate("assignEmployees", "fullName email roleName")
      .populate("assignManagerId", "fullName email");

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= GET SINGLE TASK =================
export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, isDeleted: false })
      .populate("assignEmployees", "fullName email roleName")
      .populate("assignManagerId", "fullName email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= UPDATE TASK =================
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, deadline, assignEmployees, status,assignManagerId } = req.body;

    const task = await Task.findOne({ _id: id, isDeleted: false });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found", data: null });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.deadline = deadline ?? task.deadline;
    task.status = status ?? task.status;
    task.assignManagerId = assignManagerId ?? task.assignManagerId;

    if (assignEmployees && assignEmployees.length > 0) {
      task.assignEmployees = assignEmployees;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= DELETE TASK (SOFT) =================
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, isDeleted: false });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found", data: null });
    }

    task.isDeleted = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= CHANGE TASK STATUS =================
export const changeTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({ _id: id, isDeleted: false });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found", data: null });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};


// ================= EMPLOYEE TASK LIST =================
export const getEmployeeTasks = async (req, res) => {
  try {
    const { id } = req.user; // employee id

    const tasks = await Task.find({
      assignEmployees: id,
      isDeleted: false,
    }).populate("assignManagerId", "fullName email");

    res.status(200).json({
      success: true,
      message: "My tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getManagerTasks = async (req, res) => {
  try {
    const { id } = req.user; // manager id

    const tasks = await Task.find({
      assignManagerId: id,
      isDeleted: false,
    }).populate("assignEmployees", "fullName email");

    res.status(200).json({
      success: true,
      message: "Manager tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getManagerAllTasks = async (req, res) => {
  try {
    const { id } = req.user; // manager id

    // All tasks of manager
    const tasks = await Task.find({
      assignManagerId: id,
      isDeleted: false,
    })
      .populate("assignEmployees", "fullName email roleName avatar")
      .populate("assignManagerId", "fullName email");

    // Split tasks
    const completedTasks = tasks.filter(task => task.status === "completed");
    const pendingTasks = tasks.filter(task => task.status === "pending");

    res.status(200).json({
      success: true,
      message: "Manager tasks fetched successfully",
      data: {
        totalTasks: tasks.length,
        completedTasksCount: completedTasks.length,
        pendingTasksCount: pendingTasks.length,
        completedTasks,
        pendingTasks
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};
