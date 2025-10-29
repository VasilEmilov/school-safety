# School Safety Reporting Platform

Local-first incident reporting platform composed of a NestJS REST API and a Vite + React single-page application. This README walks you through setting up the entire stack from an empty machine to a running application.

## Tech Stack

- **Backend:** NestJS, Prisma ORM, Passport JWT authentication, local file storage for evidence uploads.
- **Database:** PostgreSQL.
- **Frontend:** React 18 with Vite.
- **Containerisation:** Docker Compose for optional one-command bootstrapping.

## Repository Layout

```
backend/   # NestJS application, Prisma schema & seed script
frontend/  # React client application
docker-compose.yml  # Development docker stack (Postgres + backend)
```

---

## Prerequisites

- Node.js **18+** and npm.
- PostgreSQL **15+** (can be local or in Docker).
- Optional: Docker & Docker Compose v2 for a containerised setup.

Clone the repository and switch into the project directory:

```bash
git clone <your-fork-or-repo-url>
cd school-safety
```

---

## 1. Backend Setup

### 1.1 Environment variables

Create `backend/.env` with the variables required by the Nest application:

```dotenv
# backend/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/school_safety?schema=public
JWT_SECRET=super-secret-key
UPLOAD_DIR=./uploads
PORT=3000
```

Adjust the `DATABASE_URL` credentials/host to match your Postgres instance. `UPLOAD_DIR` is where uploaded evidence files will be stored.

### 1.2 Install dependencies

```bash
cd backend
npm install
```

### 1.3 Prepare the database

1. Ensure PostgreSQL is running and that the database from your `DATABASE_URL` exists (`school_safety` by default).
2. Generate the Prisma client and run migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate-dev   # creates or updates the schema locally
   ```

3. Seed baseline data (creates an overseer, principal account, and sample school):

   ```bash
   npm run prisma:seed
   ```

### 1.4 Start the backend API

```bash
npm run start:dev
```

The backend listens on <http://localhost:3000/api>. Confirm it is running by checking the health of the login endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"overseer@example.com","password":"ChangeMe123!"}'
```

Default seeded credentials:

| Role | Email | Password |
| --- | --- | --- |
| District overseer | `overseer@example.com` | `ChangeMe123!` |
| School administrator | `principal@example.com` | `ChangeMe123!` |

---

## 2. Frontend Setup

### 2.1 Environment variables

Create `frontend/.env` pointing the client to the backend API:

```dotenv
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2.2 Install dependencies & start Vite

```bash
cd ../frontend
npm install
npm run dev
```

Vite will print the local development URL (typically <http://localhost:5173>). Visit it in a browser, submit a report anonymously, or log in using the seeded credentials to access the admin dashboards.

---

## 3. Running Everything with Docker Compose (Optional)

If you prefer containers for the backend and database:

```bash
# from the repository root
docker compose up --build
```

This starts:

- PostgreSQL on `localhost:5432` with username/password `postgres`/`postgres`.
- Backend on `http://localhost:3000` using the environment values defined in `docker-compose.yml`.

After containers are up, run migrations and seed inside the backend service:

```bash
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run prisma:seed
```

The frontend is not containerised by default—run it locally as described above while the Docker stack hosts the API/database.

To clean up containers and volumes:

```bash
docker compose down --volumes
```

---

## API Surface (abridged)

- `POST /api/auth/login` – Obtain a JWT for overseer/school admin accounts.
- `POST /api/reports/public/:schoolSlug` – Submit an anonymous incident report (supports attachments).
- `GET /api/reports` – Authenticated list of reports (role-restricted).

Uploads are persisted to the directory pointed at by `UPLOAD_DIR` and grouped by school slug.

---

## Troubleshooting

- **Database connection errors:** Verify Postgres is reachable and that the `DATABASE_URL` matches your credentials/host/port. Re-run `npm run prisma:generate` after changing the URL.
- **JWT validation fails:** Ensure the backend and frontend share the same base API URL and that the backend was restarted after editing `.env`.
- **File permission issues on uploads:** On Unix systems, make sure the user running the backend can create directories/files within `UPLOAD_DIR` (create it manually if needed).

Happy building!
