const express = require('express');
const toDo = express();
const router = express.Router();
const dataservice = require("../controllers/toDoController");
const jwt = require('jsonwebtoken');

// Middleware to parse JSON requests
toDo.use(express.json());

// **Routes**

/**
 * @route POST /signup
 * @desc Register a new user
 */
toDo.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await dataservice.signup(username, password);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

/**
 * @route POST /login
 * @desc Login a user and return a JWT
 */
toDo.post('/login', async (req, res) => {
    try {
        const { user, pswd } = req.body;
        const result = await dataservice.login(user, pswd);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

// **Middleware for JWT Validation**
const jwtMiddleware = (req, res, next) => {
    const token = req.headers['todojwt'];

    if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized: Token missing" });
    }

    try {
        const decoded = jwt.verify(token, 'mytodo'); // Ensure the secret matches with token generation
        req.user = decoded.jwtuser; // Attach user info to the request object
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(403).json({ status: false, message: "Unauthorized: Invalid or expired token" });
    }
};

/**
 * @route POST /newtask
 * @desc Add a new task (protected route)
 */
toDo.post('/newtask', jwtMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const result = await dataservice.addTask(user, req.body);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Add Task Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

/**
 * @route GET /get-task
 * @desc Get all tasks for a user (protected route)
 */
toDo.get('/get-task', jwtMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const result = await dataservice.getTaskList(user);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Get Tasks Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

/**
 * @route PUT /task-status
 * @desc Update task status (protected route)
 */
toDo.put('/task-status', jwtMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { objId, status } = req.body;
        const result = await dataservice.taskStatus(user, objId, status);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Update Task Status Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

/**
 * @route DELETE /task-delete/:id
 * @desc Delete a task by ID (protected route)
 */
toDo.delete('/task-delete/:id', jwtMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const taskId = req.params.id;
        const result = await dataservice.taskDelete(user, taskId);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Delete Task Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

/**
 * @route DELETE /task-multiple-delete
 * @desc Delete multiple tasks by IDs (protected route)
 */
toDo.delete('/task-multiple-delete', jwtMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const taskIds = req.body.ids; // Array of task IDs to delete
        const result = await dataservice.deleteMultipleTasks(user, taskIds);
        res.status(result.statusCode).json(result);
    } catch (error) {
        console.error("Delete Multiple Tasks Error:", error.message);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

// **Exporting toDo Application**
module.exports = toDo;


module.exports = toDo;