<div align="center">

  <h1>✨ Vista ResuAI</h1>

  <p><strong>An Intelligent, AI-Powered Career Coach & Interview Preparation Platform</strong></p>

  <p>
    <a href="https://vista-resuai.vercel.app">
      <img src="https://img.shields.io/badge/Frontend-Live%20on%20Vercel-00F2FE?style=for-the-badge&logo=vercel" alt="Vercel Frontend" />
    </a>
    <a href="https://vista-resuai-4.onrender.com">
      <img src="https://img.shields.io/badge/Backend-Live%20on%20Render-46E3B7?style=for-the-badge&logo=render" alt="Render Backend" />
    </a>
    <img src="https://img.shields.io/badge/AI-Groq%20LLaMA%203.3%2070B-f05032?style=for-the-badge&logo=groq" alt="Groq AI" />
    <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  </p>

  <br />

  <p>
    <strong>Live Web App:</strong> <a href="https://vista-resuai.vercel.app">https://vista-resuai.vercel.app</a><br />
    <strong>Live Backend API:</strong> <a href="https://vista-resuai-4.onrender.com">https://vista-resuai-4.onrender.com</a>
  </p>

</div>

---

## 📋 Table of Contents
- [📖 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🖼️ Application Screenshots & Gallery](#%EF%B8%8F-application-screenshots--gallery)
- [🛠️ Technology Stack](#%EF%B8%8F-technology-stack)
- [📁 Repository Architecture](#-repository-architecture)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Endpoints Summary](#-api-endpoints-summary)
- [📄 License](#-license)

---

## 📖 Overview

**Vista ResuAI** is a full-stack web application designed to accelerate technical career preparation. By integrating cutting-edge **Groq LLaMA 3.3 70B AI**, Vista ResuAI provides candidates with:
1. **Personalized Daily Coaching**: Daily interview sprints, practice task checkoffs, and retention streak tracking.
2. **AI Resume Versioning**: Storing tailored resume profiles (*Google SWE*, *Amazon SDE*, *Backend Engineer*) and running AI match scoring against target job descriptions.
3. **Custom Interview Strategies**: Generating target technical questions, STAR behavioral answers, skill gap roadmaps, and day-by-day study schedules.
4. **Dark Glassmorphic UI**: High-end user interface built with custom SCSS, responsive CSS grid layouts, and micro-animations.

---

## ✨ Key Features

### 1. Personalized Daily Coach Dashboard (`/`)
* **Time-Aware Greeting Engine**: Automatically greets users based on their local time (*Good morning*, *Good afternoon*, *Good evening*).
* **Retention Streak Counter**: Displays a glowing `🔥 X Day Streak` badge to motivate continuous daily preparation.
* **Yesterday's Accomplishments**: Displays completed milestones (`✓ Resume version updated`, `✓ 1 Strategy generated`).
* **Today's 90-Minute Prep Sprint**: Interactive checkbox checklist (*Learn Redis & Caching*, *Solve 2 Graph Questions*, *Mock Review*) with real-time progress bar tracking.

### 2. AI Resume Versioning & Resume Vault (`/create`)
* **Resume Vault**: Store multiple tailored resume profiles (*Google SWE*, *Amazon SDE*, *Backend Engineer*, *ML Engineer*).
* **✨ AI ATS Recommendation Engine**: Paste any target Job Description and click **"✨ AI Recommend Best Resume"**. Groq AI analyzes all stored resume versions and highlights the top match with an estimated ATS fit score (e.g. `92% ATS Fit`).

### 3. Interview Strategy Studio (`/create` & `/interview/:id`)
* **Instant Report Generation**: Upload a resume PDF or choose a vault version to generate a full interview strategy.
* **Technical & Behavioral Question Sets**: Extracts core interview questions tailored to the position with sample high-scoring answers.
* **Skill Gap Roadmap**: Highlights missing skills categorized by severity (`High`, `Medium`, `Low`).
* **Day-by-Day Preparation Plan**: Provides a structured step-by-step study itinerary.

### 4. Searchable Strategy Library (`/plans`)
* **Strategy Search & Filters**: Search saved interview plans by position title or filter by match score (`High 80%+`, `Mid 60-79%`, `Low <60%`).
* **Interactive Pagination**: Browse plans effortlessly with 4-item page navigation.

---

## 🖼️ Application Screenshots & Gallery

Here is a visual tour of **Vista ResuAI** in action:

### 1. Personalized Daily Coach Dashboard
![Daily Coach Dashboard](docs/Screenshot%202026-08-07%20014657.png)

### 2. Daily Sprint Tasks & Streak Counter
![Daily Tasks & Streak](docs/Screenshot%202026-08-07%20014716.png)

### 3. AI Strategy Studio & Resume Vault Selector
![Strategy Studio](docs/Screenshot%202026-08-07%20014729.png)

### 4. Job Description Input & AI Match Recommender
![AI Match Recommender](docs/Screenshot%202026-08-07%20014746.png)

### 5. My Interview Plans Library (Filterable & Paginated)
![My Interview Plans](docs/Screenshot%202026-08-07%20014916.png)

### 6. Detailed Interview Strategy Report Page
![Interview Strategy Report](docs/Screenshot%202026-08-07%20014934.png)

### 7. Resume Vault Version Manager Modal
![Resume Vault Manager](docs/Screenshot%202026-08-07%20013224.png)

### 8. Interactive AI Resume & Interview Guide Modal
![AI Resume Guide](docs/Screenshot%202026-08-07%20013303.png)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js (Vite build engine)
- **Routing:** React Router v7
- **HTTP Client:** Axios (with authorization request interceptors & cross-site cookie support)
- **Styling:** Modular SCSS (Vanilla SCSS with CSS variable design tokens and glassmorphism)
- **Typography:** Google Fonts (`Outfit` & `Inter`)

### Backend
- **Runtime:** Node.js (Express.js)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI Integration:** `groq-sdk` (Groq API - `llama-3.3-70b-versatile`)
- **File Parsing:** `pdf-parse` & `multer` for multipart PDF document parsing
- **Authentication:** JWT (`jsonwebtoken`), `bcryptjs` password hashing, HTTP-only cookie + Bearer token fallback

---

## 📁 Repository Architecture

```
vista-resuai/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection & Google DNS fallback setup
│   │   ├── controllers/     # Auth, Interview Strategy, Resume Vault & Daily Coach controllers
│   │   ├── middlewares/     # JWT Auth middleware & Multer file upload middleware
│   │   ├── models/          # User, InterviewReport, ResumeVersion & DailyCoach schemas
│   │   ├── routes/          # Express API route declarations
│   │   ├── services/        # Groq AI prompt engine & schema validators (Zod)
│   │   └── app.js           # Express app setup & CORS policy configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Node HTTP server entrypoint
│
├── Frontend/vists-resuai/
│   ├── src/
│   │   ├── components/      # Navbar, DailyCoachWidget, ResumeVaultModal & AiTipsModal
│   │   ├── features/
│   │   │   ├── auth/        # Auth context, useAuth hook, Login & Register pages
│   │   │   └── interview/   # Daily Coach Page, Create Strategy Page, My Plans Page, Report Detail
│   │   ├── app.routes.jsx   # Client-side router configuration
│   │   ├── main.jsx         # Vite entrypoint
│   │   └── style.scss       # Global CSS tokens & reset
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                    # UI Application Screenshots
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI
- **Groq API Key**: Obtain a free API key from [Groq Console](https://console.groq.com/keys)

### 1. Clone the Repository
```bash
git clone https://github.com/pranjalgupta0280/vista-resuai.git
cd vista-resuai
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vista-resuai
JWT_SECRET=your_super_secret_jwt_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend development server:
```bash
npm start
# Server will run on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend/vists-resuai
npm install
```

Create a `.env` file in `Frontend/vists-resuai/`:
```env
VITE_API_URL=http://localhost:3000
```

Start the Vite development server:
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🔐 Environment Variables

| Scope | Variable Name | Description | Example |
| :--- | :--- | :--- | :--- |
| **Backend** | `PORT` | Express server port | `3000` |
| **Backend** | `MONGO_URI` | MongoDB Atlas / Local connection string | `mongodb+srv://...` |
| **Backend** | `JWT_SECRET` | Secret key for signing JWT tokens | `supersecretkey` |
| **Backend** | `GROQ_API_KEY` | Groq API key | `gsk_...` |
| **Frontend** | `VITE_API_URL` | Base API URL for Axios requests | `https://vista-resuai-4.onrender.com` |

---

## 📡 API Endpoints Summary

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Create a new user account
- `POST /api/auth/login` — Sign in and issue JWT token + cookie
- `POST /api/auth/logout` — Blacklist token and clear session cookie
- `GET /api/auth/me` — Verify session and return user profile

### Interview Strategy & Vault Routes (`/api/interview`)
- `POST /api/interview/` — Generate a new interview report (PDF upload or text)
- `GET /api/interview/` — Fetch all generated interview plans for user
- `GET /api/interview/report/:interviewId` — Fetch detailed interview strategy report
- `GET /api/interview/resume-versions` — Fetch user's stored resume vault versions
- `POST /api/interview/resume-versions` — Create a new resume version profile
- `DELETE /api/interview/resume-versions/:id` — Delete a resume version profile
- `POST /api/interview/recommend-resume` — Groq AI match scoring across resume versions
- `GET /api/interview/daily-coach` — Get daily coach sprint tasks & prep streak
- `PATCH /api/interview/daily-coach/toggle-task` — Check off today's prep sprint task

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ by Pranjal Gupta using React, Express, MongoDB & Groq AI</p>
</div>