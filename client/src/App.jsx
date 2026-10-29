
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }

        const data = await response.json();
        setTasks(data.tasks);
      } catch (err) {
        setError(
          "Unable to load tasks. Check that your backend and database are running."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  
async function handleSubmit(event) {
  event.preventDefault();

  try {
    setError("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create task.");
    }

    // Add the newly created task to the dashboard
    setTasks((currentTasks) => [
      data.task,
      ...currentTasks,
    ]);

    // Clear the form after successful creation
    setTitle("");
    setDescription("");
  } catch (err) {
    setError(err.message || "Unable to create task.");
  }
}


async function updateTaskStatus(task) {
  const statuses = ["Pending", "In Progress", "Completed"];

  const currentIndex = statuses.indexOf(task.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];

  try {
    setError("");

    const response = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update task status.");
    }

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? data.task : currentTask
      )
    );
  } catch (err) {
    setError(err.message || "Unable to update task status.");
  }
}

async function deleteTask(taskId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  try {
    setError("");

    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete task.");
    }

    // Remove the deleted task from the dashboard
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  } catch (err) {
    setError(err.message || "Unable to delete task.");
  }
}


  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>Task Workflow Manager</h1>
          <p className="subtitle">
            Organize your work. Track your progress.
          </p>
        </div>
      </header>

      <main className="dashboard">
        <section className="task-form-section">
          <h2>Create a new task</h2>

          <form onSubmit={handleSubmit} className="task-form">
            <label htmlFor="title">Task title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe your task"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="3"
            />

            <button type="submit" className="primary-button">
              + Add Task
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Your Tasks</h2>
              <p>Track each task from start to completion.</p>
            </div>
            <span className="task-count">
              {tasks.length} tasks
            </span>
          </div>

          {isLoading && <p>Loading tasks...</p>}

          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && tasks.length === 0 && (
            <p>No tasks found. Create your first task!</p>
          )}

          {!isLoading && !error && (
            <div className="task-grid">
              {tasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="card-top">
                    <span
                      className={`status-badge ${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                    <span className="task-id">#{task.id}</span>
                  </div>

                  <h3>{task.title}</h3>

                  <p className="task-description">
                    {task.description || "No description provided."}
                  </p>

                  <div className="card-actions">
                    <button
                      type="button"
                       onClick={() => updateTaskStatus(task)}
                      >
                      Update Status
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
