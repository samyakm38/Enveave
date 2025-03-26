import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
    try {
        // console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;