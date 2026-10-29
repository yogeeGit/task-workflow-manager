
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to check the server
app.get("/", (req, res) => {
  res.json({ message: "Task Workflow Manager API is running!" });
});

// Test the database connection
app.get("/api/db-check", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      message: "Database connection successful!",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// create a new task in the database
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Task title is required",
      });
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    const taskStatus = status || "Pending";

    if (!allowedStatuses.includes(taskStatus)) {
      return res.status(400).json({
        error: "Invalid task status",
      });
    }

    const sql = `
      INSERT INTO tasks (title, description, status)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      title.trim(),
      description || null,
      taskStatus,
    ]);

    res.status(201).json({
      message: "Task created successfully",
      task: {
        id: result.insertId,
        title: title.trim(),
        description: description || null,
        status: taskStatus,
      },
    });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// read the tasks from the database
app.get("/api/tasks", async (req, res) => {
  try {
    const sql = `
      SELECT id, title, description, status, created_at, updated_at
      FROM tasks
      ORDER BY id DESC
    `;

    const [tasks] = await pool.execute(sql);

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// update a task in the database


app.put("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid task ID",
      });
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
    ];

    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      return res.status(400).json({
        error: "Provide at least one field to update",
      });
    }

    if (title !== undefined &&
        (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        error: "Title must not be empty",
      });
    }

    if (description !== undefined &&
        description !== null &&
        typeof description !== "string") {
      return res.status(400).json({
        error: "Description must be a string or null",
      });
    }

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid task status",
      });
    }

    const [existingRows] = await pool.execute(
      "SELECT id FROM tasks WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title.trim());
    }

    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    values.push(id);

    await pool.execute(
      `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    const [updatedRows] = await pool.execute(
      `SELECT id, title, description, status, created_at, updated_at
       FROM tasks WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedRows[0],
    });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({
      error: "Failed to update task",
    });
  }
});

// delete a task from the database


app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid task ID",
      });
    }

    const [result] = await pool.execute(
      "DELETE FROM tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({
      error: "Failed to delete task",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
