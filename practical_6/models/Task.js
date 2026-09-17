const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    completed: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    completedAt: {
        type: Date,
        default: null
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    }
});


// Trim title before saving
taskSchema.pre("save", function () {
    this.title = this.title.trim();
});

module.exports = mongoose.model("Task", taskSchema);