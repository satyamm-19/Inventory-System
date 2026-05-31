# Inventory & Order Management System

Monorepo for the technical assessment: React frontend, FastAPI backend, PostgreSQL, Docker, Alembic migrations, and deployment blueprints for Render and Netlify.

## Local Development

1. Copy `.env.example` to `.env`.
2. Start the stack with Docker Compose:

```bash
docker compose up -d --build
```

3. Open the apps:
    - Backend API: http://localhost:8000
    - Frontend UI: http://localhost:3000

The backend runs a startup readiness check, applies Alembic migrations, and then starts the API.

## What Is Already Included

- FastAPI backend with products, customers, and orders endpoints
- PostgreSQL schema managed by Alembic
- React dashboard with INR currency formatting for product and order values
- Dockerfiles for both apps
- Docker Compose for local development
- Automated tests for health, product listing, and CRUD/order flow

## Deployment Plan For The PDF

Use this split for the public deployment:

1. Backend API on Render as a Docker web service.
2. PostgreSQL on Render Postgres or Supabase.
3. Frontend on Netlify or Vercel as a static site.
4. Docker Hub image for the backend service.

### 1) Backend API Deployment

Use the `render.yaml` blueprint in the repository root.

Steps:

1. Push the repository to GitHub.
2. Open Render and create a new Blueprint from the repo.
3. Render will create:
    - a Docker web service from `backend/Dockerfile`
    - a managed PostgreSQL database
4. When Render prompts for `CORS_ORIGINS`, paste your frontend hosted URL, for example:

```text
https://your-frontend.netlify.app
```

5. After deploy, copy the public backend URL from Render.

### 2) Frontend Deployment

Use Netlify or Vercel. This repo includes `netlify.toml` for a one-click Netlify setup.

Netlify steps:

1. Connect the GitHub repo.
2. Set the base directory to `frontend`.
3. Use the build command `npm run build`.
4. Publish the `dist` folder.
5. Set the frontend environment variable `VITE_API_URL` to your backend hosted URL, for example:

```text
https://your-backend.onrender.com
```

If you prefer Vercel, set the root directory to `frontend`, build command to `npm run build`, and output directory to `dist`.

### 3) Backend Docker Hub Image

Build and push the backend image to Docker Hub:

```bash
docker login
docker build -t <your-dockerhub-username>/ethara-backend:latest ./backend
docker push <your-dockerhub-username>/ethara-backend:latest
```

Use the Docker Hub repository page as the link you submit in the form:

```text
https://hub.docker.com/r/<your-dockerhub-username>/ethara-backend
```

## Submission Links You Need To Fill In

Use the public URLs from the deployed services, not local URLs.

| Form field                                  | What to paste                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Backend API Hosted URL                      | `https://<your-backend-service>.onrender.com`                                                 |
| Frontend Hosted URL                         | `https://<your-frontend-service>.netlify.app` or `https://<your-frontend-service>.vercel.app` |
| Backend Docker Hub Image Link               | `https://hub.docker.com/r/<your-dockerhub-username>/ethara-backend`                           |
| GitHub Repository Link (Frontend + Backend) | `https://github.com/<your-username>/<your-repository>`                                        |

## Recommended Environment Values

- `DATABASE_URL`: Render Postgres connection string or Supabase connection string
- `CORS_ORIGINS`: your deployed frontend URL
- `VITE_API_URL`: your deployed backend URL

## Project Structure

- `backend/` FastAPI API, models, Alembic, seed script, tests
- `frontend/` React app and static deployment config
- `docker-compose.yml` local orchestration
- `render.yaml` Render blueprint for backend and database
- `netlify.toml` frontend deployment config
