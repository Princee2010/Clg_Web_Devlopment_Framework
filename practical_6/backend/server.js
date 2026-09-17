const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("../models/Task");

const app = express();
const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

// Allow React frontend to communicate with Express
app.use(cors());

// Read JSON data from requests
app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


// ==========================================
// GET ALL TASKS
// ==========================================

app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});


// ==========================================
// GET TASK BY ID
// ==========================================

app.get("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        res.status(200).json(task);

    } catch (err) {
        next(err);
    }
});


// ==========================================
// CREATE TASK
// ==========================================

app.post("/tasks", async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        res.status(201).json({
            message: "Task Created Successfully",
            task: task
        });

    } catch (err) {
        next(err);
    }
});

// ==========================================
// UPDATE TASK
// ==========================================

app.put("/tasks/:id", async (req, res, next) => {
    try {
        const updateData = {
            ...req.body
        };

        // If task is being completed,
        // store the current date and time.
        if (updateData.completed === true) {
            updateData.completedAt = new Date();
        }

        // If task is changed back to pending,
        // remove completion time.
        if (updateData.completed === false) {
            updateData.completedAt = null;
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task Updated Successfully",
            task: task
        });

    } catch (err) {
        next(err);
    }
});

// ==========================================
// DELETE TASK
// ==========================================

app.delete("/tasks/:id", async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task Deleted Successfully"
        });

    } catch (err) {
        next(err);
    }
});


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route Not Found",
        path: req.originalUrl
    });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    console.error(err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            error: "Validation Error",
            details: Object.values(err.errors).map(
                (error) => error.message
            )
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            error: "Invalid Task ID"
        });
    }

    // Duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: "Duplicate value already exists"
        });
    }

    // Other errors
    res.status(500).json({
        success: false,
        error: "Internal Server Error"
    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});