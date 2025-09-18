# Networth - Contact Management System

A full-stack web application designed to help users manage their personal and professional contacts.  
This application provides a **secure, robust, and user-friendly interface** for creating, viewing, updating, and deleting contact information.

Built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and written entirely in **TypeScript**.

---

## 🚀 Features
- **Secure User Authentication**  
  Users can create an account and log in securely. The system uses **JSON Web Tokens (JWT)** for session management, ensuring that user data is protected.

- **Full CRUD Functionality**  
  Authenticated users can **Create, Read, Update, Delete** contacts.

- **RESTful API**  
  A well-structured backend API built with **Express.js** and **Mongoose** for interacting with the MongoDB database.

- **Responsive Frontend**  
  A clean and intuitive **React interface** that works seamlessly on desktop and mobile devices.

- **Environment-Based Configuration**  
  Sensitive information like database connection strings and JWT secrets are managed using environment variables.

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project running locally for development and testing.

### ✅ Prerequisites
You need the following installed on your machine:
- **Node.js** (v18.x or newer recommended)  
- **npm** (comes with Node.js)  
- **MongoDB Atlas account** (or a local MongoDB installation)  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name


---
### 2. Install Backend Dependencies
```bash
cd backend
npm install

---
### 3. Configure Backend Environment Variables
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_random_string
JWT_EXPIRES_IN=7d


---
### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install


---
## ▶️ Running the Application

You'll need two terminal windows: one for the backend and one for the frontend.

### Terminal 1: Run the backend
```bash
cd backend
npm run dev

The backend server will be running at http://localhost:5000

---


### Terminal 2: Run the frontend
```bash
cd frontend
npm run dev

The frontend React app will be running at http://localhost:5173







