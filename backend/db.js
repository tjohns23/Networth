import mongoose from "mongoose";

export async function connectDB() {
        try {
                await mongoose.connect("mongodb://localhost27017/Networth");
                console.log('MongoDB connected!');
        } catch (error) {
                console.error('MongoDB connection error:', error);
                process.exit(1);
        }
}