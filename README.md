# 🚀 LeetCode Clone – Full Stack MERN Platform

> A fully functional coding platform built with the MERN stack, featuring user authentication, OTP email verification, code execution (Judge0), AI-powered doubt solving, and video solutions.

🔗 **Live Demo:** [https://leetcode-frontend-2nbq.onrender.com](https://leetcode-frontend-2nbq.onrender.com)

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

---

## 📌 About the Project

This is a **complete LeetCode clone** built from scratch using the **MERN stack**. It allows users to:

- Solve coding problems in **C++**, **Java**, and **JavaScript**.
- Submit solutions with **Judge0** integration (real-time execution).
- Get **AI-powered hints** from Google Gemini.
- Watch **video solutions** uploaded by admins.
- Track solved problems and submission history.

**This project is my full-stack portfolio project — everything from authentication to deployment is built and managed by me.**

---

## ⚡ Features
## 📸 Screenshots

### 🏠 Homepage
![Homepage](assets/Screenshot%202026-07-07%20163704.png)

### 📋 Problem List
![Problem List](assets/Screenshot%202026-07-07%20163710.png)

### 💻 Code Editor with Monaco
![Code Editor](assets/Screenshot%202026-07-07%20163739.png)

### ✅ Submission Result (Accepted)
![Submission Accepted](assets/Screenshot%202026-07-07%20163803.png)

### 👤 User Profile
![Profile Page](assets/Screenshot%202026-07-07%20163923.png)

### 🔐 Admin Panel – Create Problem
![Admin Create](assets/Screenshot%202026-07-07%20164013.png)

### 🗑️ Admin Panel – Delete Problem
![Admin Delete](assets/Screenshot%202026-07-07%20164021.png)

### ✏️ Admin Panel – Update Problem
![Admin Update](assets/Screenshot%202026-07-07%20164031.png)

### 🎬 Video Solutions
![Video Solutions](assets/Screenshot%202026-07-07%20164040.png)

### 📊 My Submissions
![Submissions](assets/Screenshot%202026-07-07%20164051.png)

### 🔐 User Authentication
- JWT-based authentication with **HTTP-only cookies**
- **OTP email verification** using Nodemailer (Gmail SMTP)
- **Redis blacklist** for instant logout
- **Role-based access** (User / Admin)

### 💻 Core Platform
- **Problem Management** — Admin can Create, Read, Update, Delete (CRUD) problems
- **Visible & Hidden Test Cases** — Hidden test cases ensure correct validation
- **Code Submission** — Users can run and submit code in multiple languages
- **Judge0 Integration** — Safe, containerized code execution
- **Submission History** — Users can view their past submissions

### 🤖 AI Doubt Solver
- Integrated **Google Gemini API**
- **System Instruction** restricts AI to only DSA-related discussions
- Provides hints, solutions, code reviews, complexity analysis, and test case suggestions

### 📹 Video Solutions
- Admins can upload video solutions via **Cloudinary**
- Video thumbnails, duration, and secure URLs stored in the database

### 👤 User Profile
- View and edit profile (First Name, Last Name, Age, Phone Number)
- Upload profile image via **Cloudinary**
- Track problems solved

### 🎨 UI / UX
- **DaisyUI + Tailwind CSS** for beautiful, responsive design
- **Dark / Light Theme** toggle with persistent storage (localStorage)
- **Monaco Editor** — VS Code-like code editor

---

## 🧰 Tech Stack

### Backend
| Technology | Purpose |
| :--- | :--- |
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB (Atlas)** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Redis** | Token blacklist (logout) |
| **Nodemailer** | OTP email sending |
| **Judge0** | Code execution |
| **Cloudinary** | Media (video/image) storage |
| **Google Gemini** | AI doubt solver |

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React.js** | UI library |
| **Vite** | Build tool |
| **Redux Toolkit** | State management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Monaco Editor** | Code editor |
| **DaisyUI + Tailwind CSS** | Styling & Themes |
| **Axios** | HTTP client |

### Deployment
| Platform | Service |
| :--- | :--- |
| **Render** | Backend (Web Service) + Frontend (Static Site) |
| **MongoDB Atlas** | Database |
| **Redis Cloud** | Token blacklist |
| **Cloudinary** | Media storage |

---

## 🏛️ Architecture
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT (Browser) │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ React App (Vite) │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│ │ │ Homepage │ │ Profile │ │ Problem │ │ Admin │ │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│ │ ↓ │ │
│ │ Redux Store (Auth State) │ │
│ │ ↓ │ │
│ │ Axios Client (HTTP Requests) │ │
│ └─────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
│ (REST API / JSON)
↓
┌─────────────────────────────────────────────────────────────────┐
│ SERVER (Node.js / Express) │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Middleware Layer │ │
│ │ • CORS • Cookie-Parser • JSON Parser │ │
│ │ • userMiddleware (JWT Verify) │ │
│ │ • adminMiddleware (Role Check) │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Routes / Controllers │ │
│ │ • Auth Routes (Register/Login/Logout) │ │
│ │ • Problem Routes (CRUD) │ │
│ │ • Submission Routes (Run/Submit) │ │
│ │ • Video Routes (Upload/Delete) │ │
│ │ • AI Routes (Gemini Chat) │ │
│ └─────────────────────────────────────────────────────────┘ │
└───────────┬─────────────────────────────────┬───────────────────┘
│ │
↓ ↓
┌───────────────────────┐ ┌───────────────────────────────────┐
│ MONGODB (Atlas) │ │ EXTERNAL APIS │
│ ┌─────────────────┐ │ │ ┌─────────────────────────────┐ │
│ │ Users │ │ │ │ Judge0 (Code Execution) │ │
│ │ Problems │ │ │ └─────────────────────────────┘ │
│ │ Submissions │ │ │ ┌─────────────────────────────┐ │
│ │ SolutionVideo │ │ │ │ Cloudinary (Media) │ │
│ └─────────────────┘ │ │ └─────────────────────────────┘ │
└───────────────────────┘ │ ┌─────────────────────────────┐ │
│ │ Gemini AI (Chat) │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Redis (Token Blacklist) │ │
│ └─────────────────────────────┘ │
└───────────────────────────────────┘



---

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Redis Cloud account
- Cloudinary account
- Gemini API key
- Judge0 API key (RapidAPI)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/harsh-pro-max/leetcode-clone.git
cd leetcode-clone/backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Run the server
npm run dev

cd ../frontend

# Install dependencies
npm install

# Create .env.local file (see Environment Variables section)
# Run the development server
npm run dev
