# Inventory & Order Management System

A full-stack, production-ready inventory and order management system. This monorepo is fully containerized, featuring automated database migrations, a responsive frontend, and transactional business logic via RESTful API endpoints.

## 🚀 Live Demo

* **Frontend UI:** [https://guileless-moxie-cf3215.netlify.app]
* **Backend API (Swagger Docs):** [https://ethara-backend-3x8v.onrender.com]/docs
* **Docker Hub Image:** [https://hub.docker.com/r/satyamm19/ethara-backend]

## ⚙️ Architecture & Tech Stack

* **Frontend:** React, Vite
* **Backend:** Python, FastAPI, SQLAlchemy, Alembic
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Compose, Render (Web Service & Managed DB), Netlify
* **Data Validation:** Pydantic (Backend)

## ✨ Key Features

* **Product Management:** Complete CRUD operations with real-time stock tracking and unique SKU enforcement.
* **Customer Management:** Persistent customer profiles featuring strict email validation.
* **Order Processing:** Transactional logic enforcing inventory constraints; automatic total amount calculations and immediate stock deductions upon order creation.
* **Dashboard Analytics:** High-level metrics tracking total products, customers, orders, and real-time low-stock alerts.
* **Containerized Environments:** Isolated application services orchestrated via Docker Compose, ensuring strict parity between local development and production deployments.

## 💻 Local Development Setup

### Prerequisites

* Docker and Docker Desktop/Engine installed.

### Quick Start

1. Clone the repository and copy the environment template:
```bash
cp .env.example .env

```


2. Start the application stack using Docker Compose:
```bash
docker compose up -d --build

```


*Note: The backend container runs a readiness check and automatically applies Alembic schema migrations before launching the API.*
3. Access the local environments:
* **Frontend UI:** `http://localhost:3000`
* **Backend API:** `http://localhost:8000`
* **Interactive API Docs:** `http://localhost:8000/docs`



## 📁 Project Structure

```text
.
├── backend/              # FastAPI core, SQLAlchemy models, tests, and Alembic migrations
├── frontend/             # React application (Vite)
├── docker-compose.yml    # Local multi-container orchestration
├── render.yaml           # Infrastructure-as-code blueprint for Render (API/Postgres)
└── netlify.toml          # Build and deployment configuration for Netlify

```
