# Networth - Contact Management System
A full-stack web application designed to help users manage their personal and professional contacts. This application provides a secure, robust, and user-friendly interface for creating, viewing, updating, and deleting contact information.

Built with the MERN stack (MongoDB, Express.js, React, Node.js) and written entirely in TypeScript.

Features:
- Secure User Authentication: Users can create an account and log in securely. The system uses JSON Web Tokens (JWT) for session management, ensuring that user data is protected.

- Full CRUD Functionality: Authenticated users can perform all four CRUD (Create, Read, Update, Delete) operations on their contacts.

- RESTful API: A well-structured backend API built with Express.js and Mongoose for interacting with the MongoDB database.

- Responsive Frontend: A clean and intuitive user interface built with React that works seamlessly on both desktop and mobile devices.

- Environment-Based Configuration: Securely manages sensitive information like database connection strings and JWT secrets using environment variables

  

# Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites:
- You need to have the following software installed on your machine:

- Node.js (v18.x or newer recommended)

- npm (usually comes with Node.js)

- A MongoDB Atlas account for the database, or a local MongoDB installation.

# Installation & Setup
Clone the Repository

git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name

Install Backend Dependencies

cd backend
npm install

Set Up Backend Environment Variables

In the backend folder, create a new file named .env.

Copy the contents of .env.example (if you have one) or use the template below and fill in your own values.

.env template:

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_super_secret_random_string
- JWT_EXPIRES_IN=7d

Install Frontend Dependencies

cd ../frontend
npm install

Running the Application:

You will need two separate terminal windows to run both the backend and frontend servers concurrently.


# In Terminal 1, navigate to the backend folder
cd backend
npm run dev

The backend server should now be running on http://localhost:5000.

Run the Frontend Server

# In Terminal 2, navigate to the frontend folder
cd ../frontend
npm run dev

The React development server should now be running, typically on http://localhost:5173. You can open this URL in your browser to use the application.
