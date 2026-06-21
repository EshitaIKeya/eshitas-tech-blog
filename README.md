# Eshita's Tech Blog

A full-stack personal blog application built with **FastAPI** (Python) and **React** (JavaScript), running on **PostgreSQL** with **Docker** support.

## Features

- **Rich Text Editor** — write blog posts with bold, italic, headings, code blocks, lists, and links (powered by Quill)
- **JWT Authentication** — secure Bearer token auth via HTTP headers
- **Role-Based Access** — admin creates posts, users can comment and react
- **Reactions System** — like, love, sad, angry (one per user per post)
- **Comments** — logged-in users can comment, edit, and delete their own comments
- **Categories** — organize posts by topic, filter on homepage
- **Search** — search posts by title
- **Pagination** — posts load page by page (10 per page)
- **Reading Time** — estimated reading time on every post
- **3 Themes** — Light, Dark, and Eye Care mode
- **Profile** — view your info and change your password

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL |
| Frontend | React, React Router, Axios |
| Editor | react-quill-new |
| Auth | JWT (python-jose), bcrypt |
| Containerization | Docker, docker-compose |

## Database Schema

7 tables: `roles`, `users`, `categories`, `posts`, `comments`, `reaction_types`, `reactions`

Designed with [dbdiagram.io](https://dbdiagram.io) and implemented via SQLAlchemy ORM.

## Quick Start (Docker) — Recommended

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Clone the repo
git clone https://github.com/EshitaIKeya/eshitas-tech-blog.git
cd eshitas-tech-blog

# 2. Start everything (database + backend + frontend)
docker-compose up --build

# 3. Open in browser
#    Frontend: http://localhost:3000
#    Backend API docs: http://localhost:8000/docs
```

**Default admin login:**
- Username: `Eshita`
- Password: `changeme123` (change via ADMIN_PASSWORD in docker-compose.yml)

To stop: `docker-compose down`

To reset database: `docker-compose down -v` (deletes all data)

## Manual Setup (Without Docker)

### Backend

**Prerequisites:** Python 3.11+, PostgreSQL installed and running.

```bash
# 1. Create the database in pgAdmin or psql
CREATE DATABASE blog_db;

# 2. Setup backend
cd backend
python -m venv venv

# Windows PowerShell:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/blog_db

# 4. Run the server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

**Prerequisites:** Node.js 18+ installed.

```bash
# 1. Setup frontend
cd frontend
npm install

# 2. Create .env file (optional, defaults to localhost:8000)
cp .env.example .env

# 3. Run
npm start
```

Frontend runs at `http://localhost:3000`.

## API Endpoints

### Auth
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login, get token | No |
| GET | /auth/me | Get current user info | Bearer |
| PUT | /auth/change-password | Change password | Bearer |

### Posts
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /posts/?page=1&limit=10&category_id=1&q=search | List posts (paginated) | No |
| GET | /posts/{id} | Get single post | No |
| POST | /posts/ | Create post | Admin |
| PUT | /posts/{id} | Update post | Admin |
| DELETE | /posts/{id} | Delete post | Admin |

### Comments
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /posts/{id}/comments | Get comments for a post | No |
| POST | /posts/{id}/comments | Add comment | Bearer |
| PUT | /comments/{id} | Edit your comment | Bearer |
| DELETE | /comments/{id} | Delete comment | Bearer/Admin |

### Reactions
| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | /posts/{id}/reaction | Get reactions for a post | No |
| POST | /posts/{id}/reaction | Add/change reaction | Bearer |
| DELETE | /posts/{id}/reaction | Remove reaction | Bearer |

### Categories, Roles, Users
Full CRUD available — see `/docs` for details.

## Project Structure

```
eshitas-tech-blog/
├── backend/
│   ├── app/
│   │   ├── models/        ← Database tables (SQLAlchemy)
│   │   ├── schemas/       ← Request/response validation (Pydantic)
│   │   ├── routers/       ← API endpoints
│   │   ├── utils/         ← Helpers (hashing, JWT)
│   │   ├── main.py        ← App entry point
│   │   ├── database.py    ← DB connection
│   │   ├── config.py      ← Environment variables
│   │   ├── dependencies.py ← Auth dependencies (Bearer token)
│   │   └── seed.py        ← Default data seeder
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    ← Navbar, Footer, ThemeToggle
│   │   ├── pages/         ← Home, Login, Register, CreatePost, etc.
│   │   ├── api.js         ← Axios with Bearer token interceptor
│   │   ├── App.js         ← Routes
│   │   └── App.css        ← All styles with CSS variables
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Built By

**Eshita Islam** — Computer Science student, intern at Apurba Technologies Inc.

Built from scratch as a learning project to understand full-stack web development: database design, REST APIs, authentication, frontend-backend integration, and containerized deployment.
