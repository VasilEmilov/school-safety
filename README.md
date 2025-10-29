# School Safety Reporting Platform

This repository contains the local-first school violence reporting platform with a NestJS backend and Vite React frontend.

## Project Structure

- `backend/` – NestJS API with Prisma ORM, JWT auth, and local file storage abstraction.
- `frontend/` – Vite + React single-page application for report submission and dashboards.
- `docker-compose.yml` – Local development environment (backend + PostgreSQL).

## Backend Setup

```bash
cd backend
npm install
```

### Database Migrations

```bash
npm run prisma:migrate
```

### Seed Data

```bash
npm run prisma:seed
```

### Development Server

```bash
npm run start:dev
```

The backend exposes:

- `POST /api/auth/login`
- `POST /api/reports/public/:schoolSlug`
- `GET /api/reports`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Docker Compose

```bash
docker-compose up --build
```

This starts PostgreSQL and the backend service. The backend runs on `http://localhost:3000`.

## Test Login via cURL

After seeding the database:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"overseer@example.com","password":"ChangeMe123!"}'
```
