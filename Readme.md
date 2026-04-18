<div align="center">
  

<!-- ![Vista ResuAI Banner](docs/images/banner-placeholder.png) -->
  
  # 🚀 Vista ResuAI

  An intelligent, AI-powered platform for building, analyzing, and optimizing resumes. Vista ResuAI leverages modern web technologies and the cutting-edge **Google Gemini API** to help users craft standout resumes, get real-time feedback, and land their dream jobs.

</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

Vista ResuAI simplifies the resume creation process. By uploading an existing resume or starting from scratch, users can utilize our integrated AI engine (powered by Google's Gemini) to automatically extract details, suggest impactful action verbs, correct grammar, and tailor their resumes to specific job descriptions. 

---

## ✨ Features

- **🔐 Secure Authentication:** Robust user signup and login system with dark-mode supported UI.
- **📄 Smart Resume Parsing:** Upload your existing resume (powered by `multer`) and let the system extract your details.
- **🧠 AI-Powered Enhancements:** Integrated with `@google/genai` to provide intelligent suggestions, summary generation, and content improvements.
- **💾 Secure Storage:** All user data and generated resumes are safely stored using MongoDB.
- **🎨 Responsive Design:** A beautiful, responsive user interface built with modular SCSS.

---

**🧠 Screenshots** 

![Vista ResuAI Signup](docs/images/Screenshot%202026-04-18%20170358.png)
![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20170422.png)
![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20170522.png)
![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20170557.png)
![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20170612.png)
![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20170628.png)

**🧠 DATABASE SCHEMA**
 ![Vista ResuAI Banner](docs/images/Screenshot%202026-04-18%20171202.png)
| Authentication Page | User Dashboard | AI Resume Editor |
| :---: | :---: | :---: |
| !Auth Page | !Dashboard | !Editor |

*Replace the placeholders in the `docs/images` folder with actual screenshots of your application.*

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Modern JavaScript Framework (React/Vue/Angular)
- **Styling:** SCSS (with extensive theming and Dark Mode support)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via `mongodb` native driver / Mongoose)
- **File Uploads:** `multer` for handling multipart/form-data (resume file uploads)
- **AI Integration:** `@google/genai` (Google Gemini API)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v16.x or higher)
- MongoDB (Local instance or Atlas URI)
- A Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables by creating a `.env` file (see Environment Variables section below).

4. Start the backend development server:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   *The backend should now be running on `http://localhost:5000` (or your configured port).*

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend/vists-resuai
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   # or
   npm run dev
   ```
   *The frontend should now be running and accessible via your browser.*

---

## 🔐 Environment Variables

Create a `.env` file in your `Backend` directory and add the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=your_jwt_secret_for_authentication
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.