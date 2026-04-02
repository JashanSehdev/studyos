# 📚 StudyOS

> **An all-in-one academic productivity platform for university students**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

---

## 🧭 Table of Contents

- [About](#-about)
- [Modules](#-modules)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Security](#-security)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Author](#-author)

---

## 🎯 About

**StudyOS** replaces the scattered mess of apps, spreadsheets, and sticky notes that students use to manage their academic life. It centralises timetables, assignments, GPA tracking, focus sessions, and AI-powered notes into a single, secure, fast platform — built from scratch with production-grade architecture.

---

## 🧩 Modules

| Module | Description |
|---|---|
| 📊 **Dashboard** | Aggregated view of upcoming tasks, GPA snapshot, and today's schedule |
| 📅 **Timetable Manager** | Weekly class schedule with persistent slot management |
| 📝 **Assignments Tracker** | Track deadlines, status, and priority across all subjects |
| 🎓 **GPA Calculator** | Indian 10-point scale with subject-wise credit and grade input |
| ⏱ **Pomodoro Timer** | Focus sessions with animated SVG progress ring and cycle counter |
| 🤖 **AI Notes** | Claude-powered note assistant for context-aware academic help |

---

## 🏗 Architecture

```
┌─────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
│      Frontend       │        │       Backend        │        │      Database        │
│                     │        │                      │        │                      │
│   React 18 + Vite   │──────▶│  Node.js + Express    │──────▶│     PostgreSQL       │
│   Tailwind CSS v4   │        │   REST API           │        │  SQL Migrations      │
│   React Router v6   │        │   JWT (HttpOnly)     │        │  Normalized Schema   │
└─────────────────────┘        └──────────────────────┘        └──────────────────────┘
                                 
```

### Request Lifecycle

```
Client Request
     │
     ▼
React Router  ──▶  Protected Route Check
     │                     │
     │              JWT Cookie Valid?
     │               Yes ──┘  No ──▶  Redirect to /login
     ▼
Express Route Handler
     │
     ▼
Auth Middleware  ──▶  Verify JWT  ──▶  Attach user to req
     │
     ▼
Controller  ──▶  PostgreSQL Query  ──▶  JSON Response
```

---

## 🛠 Tech Stack

### Frontend
- **React 18** — Component-based UI
- **Vite** — Lightning-fast dev server and bundler
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS v4** — CSS-based config, utility-first styling

### Backend
- **Node.js + Express.js** — REST API server
- **JWT** — Stateless authentication via HttpOnly cookies
- **bcrypt** — Password hashing

### Database
- **PostgreSQL** — Relational database
- **SQL Migrations** — Version-controlled schema changes

### Integrations
- **Claude AI (Anthropic API)** — AI-powered notes assistant

### Dev Tools
- **Postman** — API testing
- **Git + GitHub** — Version control

---

## 🔒 Security

- JWT tokens are stored in **HttpOnly cookies** — never in `localStorage`, eliminating XSS-based token theft
- All protected API routes verify the JWT server-side on every request
- Passwords are hashed with **bcrypt** before storage — plaintext never touches the database
- CORS is configured to allow requests only from the trusted frontend origin

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JashanSehdev/StudyOS.git
cd StudyOS
```

```bash
# 2. Set up the backend
cd server
npm install
cp .env.example .env       # Fill in your values (see below)
npm run migrate.js          # Run database migrations
npm run dev                # Starts on http://localhost:5000
```

```bash
# 3. Set up the frontend (new terminal)
cd client
npm install
npm run dev                # Starts on http://localhost:5173
```

---

## ⚙ Environment Variables

Create a `.env` file inside the `/server` directory:

```env
DATABASE_URL     = postgresql://user:password@localhost:5432/studyos
JWT_SECRET       = your_super_secret_jwt_key
ANTHROPIC_API_KEY= sk-ant-your-api-key-here
PORT             = 5000
CLIENT_ORIGIN    = http://localhost:5173
```

---

## 📁 Project Structure

```
StudyOS/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Timetable.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── GPA.jsx
│   │   │   ├── Pomodoro.jsx
│   │   │   └── Notes.jsx
│   │   ├── context/          # Auth context / global state
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                   # Express backend
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth middleware (JWT verify)
│   ├── migrations/           # SQL migration files
│   ├── routes/               # API route definitions
│   └── index.js
│
└── README.md
```

---

## 👨‍💻 Author

**Jashan Sehdev**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jashan-sehdev-57404027a/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/JashanSehdev)

---

<p align="center">Built with focus, caffeine, and way too many Pomodoro sessions ☕</p>
