
# Task Workflow Manager

A full-stack task management application built with React, Express.js, and MySQL. Users can create tasks, view saved tasks, update their status, and delete tasks.

## Features

- Create tasks with a title and description
- View tasks stored in MySQL
- Update task status: Pending, In Progress, or Completed
- Delete tasks with confirmation
- Responsive React dashboard
- REST API with CRUD operations
- Parameterized SQL queries to help prevent SQL injection
- Input validation and error handling

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MySQL2
- REST API
- dotenv
- CORS

### Tools
- VS Code
- Postman
- MySQL Workbench
- Git and GitHub

## Project Structure

```text
task-workflow-manager/
├── client/             # React + Vite frontend
├── db.js               # MySQL connection pool
├── index.js            # Express API and routes
├── .env                # Local environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- MySQL Server
- Git

## Database Setup

Create the database and table in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS task_manager_db;

USE task_manager_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed')
        NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Configuration

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_mysql_password
DB_NAME=task_manager_db
PORT=5000
```

Replace the example password with your local MySQL password. Never commit your actual `.env` file.

## Installation and Running

### 1. Install backend dependencies

From the project root:

```bash
npm install
```

### 2. Start the backend

```bash
node index.js
```

The API runs at `http://localhost:5000`.

### 3. Install frontend dependencies

Open a second terminal from the project root:

```bash
cd client
npm install
```

### 4. Start the frontend

From the `client` directory:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Keep both terminals running while using the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update task details or status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: Create a task

Send a `POST` request to `http://localhost:5000/api/tasks`:

```json
{
  "title": "Build Dashboard",
  "description": "Create the task management interface"
}
```

The task defaults to `Pending` when a status is not provided.

## Task Statuses

- `Pending`
- `In Progress`
- `Completed`

## Security and Validation

- SQL values are passed using parameterized queries.
- Task input is validated by the backend.
- Database credentials are stored in local environment variables.
- `.env` and dependency directories are excluded from version control.

## Future Improvements

- User authentication and authorization
- Search and filter tasks by status
- Pagination
- Automated testing
- Deployment of the frontend, API, and database

## Author

Yogeshwaran
