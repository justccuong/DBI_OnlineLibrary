# Online Library

Modern React frontend plus Express API for a Microsoft SQL Server library project.

If SQL Server is not ready yet, the backend can still run in mock mode so you can keep working on the UI and flows.

## Project structure

- `frontend/`: Vite + React application
- `backend/`: Express API using `mssql`
- `database/`: SQL Server schema, seed data, and setup helper script

## What the app supports

- browse books from SQL Server
- filter by category
- view book details
- register and login
- borrow books
- view personal borrow history
- admin CRUD for books and category assignment

## SQL tables used by the backend

- `[Role]`
- `Author`
- `Category`
- `Book`
- `[User]`
- `Access_log`
- `Rate`
- `Book_Author`
- `Book_Category`

## How the frontend connects to the database

1. The React app calls endpoints like `/api/books`, `/api/auth/login`, and `/api/books/borrow`.
2. In local development, Vite proxies `/api/*` requests to `http://localhost:3000`.
3. The Express backend receives the request in `backend/server.js`.
4. Route files in `backend/src/router/` run SQL queries through `mssql`.
5. Database access is configured in `backend/src/configs/db.js`.
6. Queries use `pool().request().input(...)` so values are passed safely as SQL parameters.
7. SQL Server returns rows, Express turns them into JSON, and React renders the result.

## Environment setup

Copy `backend/.env.example` to `backend/.env`.

Important fields:

- `DB_SERVER`: usually `localhost`
- `DB_NAME`: `OnlineLibrary`
- `DB_PORT`: usually `1433`
- `DB_USER` and `DB_PASSWORD`: only needed when SQL Server authentication is enabled
- `USE_MOCK_DATA=false`: required if you want the app to use the real database

## Quick start

Install dependencies:

```bash
npm run install:all
```

Run frontend and backend together:

```bash
npm run dev
```

## Create the database

### Option 1: easiest on this machine

This uses Windows authentication through `sqlcmd`:

```powershell
powershell -ExecutionPolicy Bypass -File .\database\setup-db.ps1
```

That script runs:

- [schema.sql](/E:/_FPT_UNI_/Kì%202/DBI202/last-prj-web/DBI_OnlineLibrary/database/schema.sql)
- [seed.sql](/E:/_FPT_UNI_/Kì%202/DBI202/last-prj-web/DBI_OnlineLibrary/database/seed.sql)

### Option 2: run manually in SSMS

1. Open SQL Server Management Studio.
2. Connect to your local SQL Server instance.
3. Open [schema.sql](/E:/_FPT_UNI_/Kì%202/DBI202/last-prj-web/DBI_OnlineLibrary/database/schema.sql) and execute it.
4. Open [seed.sql](/E:/_FPT_UNI_/Kì%202/DBI202/last-prj-web/DBI_OnlineLibrary/database/seed.sql) and execute it.

## Demo SQL accounts

- admin: `admin@demo.local` / `Admin123`
- member: `student@demo.local` / `Member123`

## Important SQL Server note

On this computer, the SQL Server service is running, but TCP port `1433` is not currently listening. That means:

- `sqlcmd -E` works locally
- the Node backend cannot connect yet through `localhost:1433`

To let the backend use the real database instead of mock mode, enable TCP/IP in SQL Server Configuration Manager, restart the SQL Server service, and then update `backend/.env` with the correct connection settings.

If you are not ready for that part yet, you can still run the app in mock mode.
