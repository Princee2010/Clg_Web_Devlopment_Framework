const BASE_URL = "http://localhost:5000";

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Something went wrong"
    );
  }

  return data;
}

// GET all tasks
export const getTasks = () => {
  return request("/tasks");
};

// POST create task
export const createTask = (task) => {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
};

// PUT update task
export const updateTask = (id, task) => {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
};

// DELETE task
export const deleteTask = (id) => {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
};