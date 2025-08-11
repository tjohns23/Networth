import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from "./routes/contactRoutes.js";
import connectDB from './config/db.js';

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// Listen on the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
