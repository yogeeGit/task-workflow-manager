# Task Workflow Manager API

A RESTful task management backend built with Node.js, Express, and MySQL. It supports full CRUD operations, task status tracking, input validation, and parameterized SQL queries.

## Features

- Create tasks with a title, description, and status.
- Retrieve all tasks from MySQL.
- Update one or more task fields.
- Delete tasks by ID.
- Track task creation and modification timestamps.
- Validate task IDs, titles, and allowed statuses.
- Use parameterized SQL queries to help prevent SQL injection.
- Manage database connections through a MySQL connection pool.

## Tech Stack

- Node.js
- Express.js
- MySQL 8
- mysql2
- dotenv
- cors

## Project Structure

```text
task-workflow-manager/
├── db.js
├── index.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager_db
PORT=5000
```

Replace the example password with your local MySQL password. Never commit `.env` to GitHub.

### 3. Create the database

Create the `task_manager_db` database and the `tasks` table using the SQL schema developed for this project.

### 4. Start the server

```bash
node index.js
```

The API runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/api/db-check` | Check database connectivity |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Retrieve all tasks |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Task Statuses

Supported statuses:

- `Pending`
- `In Progress`
- `Completed`

New tasks default to `Pending` when no status is provided.

## Security and Validation

- SQL values are passed using parameterized queries.
- Task IDs and task fields are validated.
- Database credentials are stored in environment variables.
- `.env` and `node_modules/` should be excluded from version control.

## Future Improvements

- Add pagination and filtering by task status.
- Add automated API tests.
- Introduce authentication and authorization.
- Add a frontend for managing tasks.

## Author

Developed as a backend project to practice REST APIs, Express.js, SQL, and database integration.
