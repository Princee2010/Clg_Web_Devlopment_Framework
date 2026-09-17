import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";


function Tasks() {

  // ==========================================
  // STATE
  // ==========================================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });


  // ==========================================
  // FORMAT DATE AND TIME
  // ==========================================

  const formatDateTime = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };


  // ==========================================
  // GET ALL TASKS
  // ==========================================

  const loadTasks = async () => {

    try {

      setLoading(true);
      setError(null);

      const data = await getTasks();

      setTasks(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  // Load tasks when page opens
  useEffect(() => {
    loadTasks();
  }, []);


  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };


  // ==========================================
  // CREATE / UPDATE TASK
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.title.trim()) {

      setToast({
        message: "Task title is required",
        type: "error",
      });

      return;
    }


    try {

      setSaving(true);


      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {

        const currentTask = tasks.find(
          (task) => task._id === editingId
        );


        const data = await updateTask(
          editingId,
          {
            title: form.title,
            description: form.description,
            priority: form.priority,

            // Keep existing status
            completed: currentTask?.completed || false,

            // Keep existing completion time
            completedAt: currentTask?.completedAt || null,
          }
        );


        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === editingId
              ? data.task
              : task
          )
        );


        setToast({
          message: "Task updated successfully",
          type: "success",
        });


        setEditingId(null);

      }


      // ======================================
      // CREATE
      // ======================================

      else {

        const data = await createTask({

          title: form.title,

          description: form.description,

          priority: form.priority,

          // New task always starts pending
          completed: false,

          // No completion time yet
          completedAt: null,
        });


        setTasks((previousTasks) => [
          ...previousTasks,
          data.task,
        ]);


        setToast({
          message: "Task created successfully",
          type: "success",
        });
      }


      // Reset form

      setForm({
        title: "",
        description: "",
        priority: "medium",
      });


    } catch (err) {

      setToast({
        message: err.message,
        type: "error",
      });

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // COMPLETE TASK
  // ==========================================

  const handleComplete = async (task) => {

    try {

      const data = await updateTask(
        task._id,
        {
          title: task.title,

          description: task.description || "",

          priority: task.priority || "medium",

          completed: true,

          // Backend will generate the actual
          // completion date/time.
          completedAt: new Date(),
        }
      );


      setTasks((previousTasks) =>
        previousTasks.map((currentTask) =>
          currentTask._id === task._id
            ? data.task
            : currentTask
        )
      );


      setToast({
        message: "Task completed successfully",
        type: "success",
      });


    } catch (err) {

      setToast({
        message: err.message,
        type: "error",
      });

    }
  };


  // ==========================================
  // EDIT TASK
  // ==========================================

  const handleEdit = (task) => {

    setEditingId(task._id);

    setForm({
      title: task.title,

      description: task.description || "",

      priority: task.priority || "medium",
    });
  };


  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
      return;
    }


    try {

      await deleteTask(id);


      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== id
        )
      );


      setToast({
        message: "Task deleted successfully",
        type: "success",
      });


    } catch (err) {

      setToast({
        message: err.message,
        type: "error",
      });

    }
  };


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      title: "",
      description: "",
      priority: "medium",
    });
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <Spinner />;
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div>

        <ErrorMessage message={error} />

        <button onClick={loadTasks}>
          Retry
        </button>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="tasks-page">

      {/* Toast */}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />


      {/* PAGE TITLE */}

      <h1>Task Manager</h1>


      {/* =====================================
          CREATE / UPDATE FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="task-form"
      >

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
        />


        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={handleChange}
        />


        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >

          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>

        </select>


        {/* No Completed checkbox */}


        <button
          type="submit"
          disabled={saving}
        >

          {saving
            ? "Saving..."
            : editingId
            ? "Update Task"
            : "Create Task"}

        </button>


        {editingId && (

          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>

        )}

      </form>


      {/* =====================================
          TASK LIST
      ====================================== */}

      <h2>All Tasks</h2>


      {tasks.length === 0 ? (

        <p>No tasks found.</p>

      ) : (

        tasks.map((task) => (

          <div
            className="task-card"
            key={task._id}
          >

            {/* TITLE */}

            <h3>
              {task.title}
            </h3>


            {/* DESCRIPTION */}

            <p>
              {task.description ||
                "No description"}
            </p>


            {/* STATUS */}

            <p>
              <strong>Status:</strong>{" "}

              {task.completed
                ? "Completed"
                : "Pending"}
            </p>


            {/* PRIORITY */}

            <p>
              <strong>Priority:</strong>{" "}
              {task.priority}
            </p>


            {/* CREATED TIME */}

            <p>
              <strong>Created:</strong>{" "}
              {formatDateTime(task.createdAt)}
            </p>


            {/* COMPLETED TIME */}

            <p>
              <strong>Completed:</strong>{" "}

              {task.completed
                ? formatDateTime(task.completedAt)
                : "—"}
            </p>


            {/* COMPLETE BUTTON */}

            {!task.completed && (

              <button
                onClick={() =>
                  handleComplete(task)
                }
              >
                Complete Task
              </button>

            )}


            {/* EDIT BUTTON */}

            <button
              onClick={() =>
                handleEdit(task)
              }
            >
              Edit
            </button>


            {/* DELETE BUTTON */}

            <button
              onClick={() =>
                handleDelete(task._id)
              }
            >
              Delete
            </button>

          </div>

        ))
      )}

    </div>
  );
}

export default Tasks;