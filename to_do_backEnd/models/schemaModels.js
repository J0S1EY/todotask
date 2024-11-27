const mongoose = require('mongoose');

// Schema for individual tasks
const taskSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    title: { type: String, required: true },
    task: { type: String, required: true },
    taskStatus: { type: String, enum: ['completed', 'pending', 'canceled', 'deleted'], required: true },
});

// Schema for the main Todo tasks
const todoSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    taskCount: {
        completedTask: { type: Number, default: 0 },
        pendingTask: { type: Number, default: 0 },
        canceledTask: { type: Number, default: 0 },
        deletedTask: { type: Number, default: 0 },
        totalTask: { type: Number, default: 0 },
    },
    taskList: [taskSchema], // Embedding the task schema as an array
});

// Creating a model from the schema
const Todotasks = mongoose.model('Todotasks', todoSchema);

module.exports = Todotasks;