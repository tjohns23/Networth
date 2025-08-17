import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('MongoDB Connection Error:', error.message);
        }
        else {
            console.error('An unknown error occurred:', error);
        }
        process.exit(1);
    }
};
export default connectDB;
