const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connectDb = require("../bin/config");
const Todotasks = require("../models/schemaModels");
require("dotenv").config({ path: "../bin/.env" });

// Utility: Connect to database
const ensureDbConnection = async () => {
    try {
        await connectDb();
    } catch (error) {
        throw new Error("Database connection failed.");
    }
};

ensureDbConnection()


// Utility: Validate user credentials
const validateUserCredentials = async (username, password) => {
    const user = await Todotasks.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw { status: 401, message: "Invalid username or password" };
    }
    return user;
};

// Register User
const signup = async (username, password) => {
    try {
        const userExists = await Todotasks.findOne({ username });
        if (userExists) {
            return { status: false, message: "Username already exists", statusCode: 409 };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Todotasks({
            username,
            password: hashedPassword,
            taskCount: {
                completedTask: 0,
                pendingTask: 0,
                canceledTask: 0,
                deletedTask: 0,
                totalTask: 0,
            },
            taskList: [],
        });
        await newUser.save();

        return { status: true, message: "Registration successful", statusCode: 201 };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: "Error during registration", statusCode: 500 };
    }
};

// Login User
const login = async (username, password) => {
    try {
        // Validate user credentials
        const user = await validateUserCredentials(username, password);

        // Create JWT with minimal information
        const token = jwt.sign(
            { jwtuser: user.username }, // Only store necessary details
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        // Return success response with token
        return {
            status: true,
            message: "Login successful",
            username: user.username,
            statusCode: 200,
            token,
        };
    } catch (error) {
        const { status, message } = error;
        return {
            status: false,
            message: message || "Error during login",
            statusCode: status || 500,
        };
    }
};

// Add New Task
const addTask = async (username, taskDetails) => {
    const { taskId, title, task } = taskDetails;
    try {
        const user = await Todotasks.findOne({ username });
        user.taskList.push({
            taskId,
            title,
            task,
            taskStatus: "pending",
        });
        user.taskCount.pendingTask += 1;
        user.taskCount.totalTask += 1;
        await user.save();
        return { status: true, message: "Task added successfully", statusCode: 200 };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: "Error adding task", statusCode: 500 };
    }
};

// Fetch Task List
const getTaskList = async (username) => {
    try {
        const user = await Todotasks.findOne({ username });
        return {
            status: true,
            message: "Tasks fetched successfully",
            statusCode: 200,
            data: user.taskList,
            taskCount: user.taskCount,
        };
    } catch (error) {
        const { status, message } = error;
        return { status: false, message: message || "Error fetching tasks", statusCode: status || 500 };
    }
};

// Update Task Status
const updateTaskStatus = async (username, taskId, newStatus) => {
    try {
        const user = await Todotasks.findOne({ username });
        const task = user.taskList.find((t) => t.taskId === taskId);
        if (!task) {
            return { status: false, message: "Task not found", statusCode: 404 };
        }
        const validStatuses = ["pending", "completed", "canceled"];
        if (!validStatuses.includes(newStatus)) {
            return { status: false, message: "Invalid task status", statusCode: 400 };
        }

        if (task.taskStatus !== newStatus) {
            user.taskCount[`${task.taskStatus}Task`] -= 1;
            user.taskCount[`${newStatus}Task`] += 1;
            task.taskStatus = newStatus;
        }

        await user.save();

        return { status: true, message: "Task status updated", statusCode: 200 };
    } catch (error) {
        const { status, message } = error;
        return { status: false, message: message || "Error updating task status", statusCode: status || 500 };
    }
};

// Delete Single Task
const deleteTask = async (username, taskId) => {
    try {
        const user = await Todotasks.findOne({ username });
        const taskIndex = user.taskList.findIndex((t) => t.taskId === taskId);
        if (taskIndex === -1) {
            return { status: false, message: "Task not found", statusCode: 404 };
        }
        const task = user.taskList.splice(taskIndex, 1)[0];
        user.taskCount[`${task.taskStatus}Task`] -= 1;
        user.taskCount.deletedTask += 1;
        user.taskCount.totalTask -= 1;

        await user.save();

        return { status: true, message: "Task deleted successfully", statusCode: 200 };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: "Error deleting task", statusCode: 500 };
    }
};

// Delete Multiple Tasks
const deleteMultipleTasks = async (username, taskIds) => {
    try {
        const user = await Todotasks.findOne({ username });
        let removedCount = 0;
        user.taskList = user.taskList.filter((task) => {
            if (taskIds.includes(task.taskId)) {
                user.taskCount[`${task.taskStatus}Task`] -= 1;
                user.taskCount.deletedTask += 1;
                removedCount += 1;
                return false;
            }
            return true;
        });
        user.taskCount.totalTask -= removedCount;
        await user.save();
        return { status: true, message: `${removedCount} tasks deleted`, statusCode: 200 };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: "Error deleting tasks", statusCode: 500 };
    }
};

// Exporting Functions
module.exports = {
    signup,
    login,
    addTask,
    getTaskList,
    updateTaskStatus,
    deleteTask,
    deleteMultipleTasks,
};
