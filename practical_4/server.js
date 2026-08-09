const express = require("express");

const app = express();
const PORT = 5000;

// Middleware to read JSON data
app.use(express.json());


// Content-Type Validation Middleware
app.use((req, res, next) => {

    if (
        (req.method === "POST" || req.method === "PUT") &&
        !req.is("application/json")
    ) {
        return res.status(400).json({
            error: "Content-Type must be application/json"
        });
    }

    next();

});

// Route Specific Middleware
function validateTaskId(req, res, next) {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid Task ID"
        });
    }

    req.taskId = id;

    next();

}

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});
// In-Memory Task Storage
let tasks = [
    {
        id: 1,
        title: "Complete Node.js Lab",
        completed: false
    },
    {
        id: 2,
        title: "Study Express",
        completed: true
    }
];

// GET All Tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});
// POST - Create a New Task
app.post("/tasks", (req, res) => {

    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        completed: completed || false
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task Created Successfully",
        task: newTask
    });

});

// PUT - Update Task
app.put("/tasks/:id", validateTaskId, (req, res) => {
const id = req.taskId;
    // Find the task
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    // Update values
    task.title = req.body.title || task.title;
    task.completed = req.body.completed ?? task.completed;

    res.status(200).json({
        message: "Task Updated Successfully",
        task: task
    });

});

// DELETE - Delete Task
app.delete("/tasks/:id", validateTaskId, (req, res) => {

    const id = req.taskId;

    // Find task index
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    // Remove task
    tasks.splice(index, 1);

    res.status(200).json({
        message: "Task Deleted Successfully"
    });

});

// 404 Handler
app.use((req, res) => {

    res.status(404).json({
        error: "Route Not Found"
    });

});

// Global Error Handler
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        error: "Something went wrong"
    });

});

// Test Route
app.get("/", (req, res) => {
    res.send("Task Manager API is Running...");
});


// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route Not Found",
        path: req.originalUrl,
        method: req.method
    });
});

// MUST BE THE LAST MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        error: "Something went wrong"
    });
});





// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

