import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteer.route.js';
import authRoutes from './routes/auth.route.js';
import connectDB from './config/db.js'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {env} from "./config/env.js";
import {applySignupDelay} from "./helpers/securityHelper.js";
import storyRoute from "./routes/story.route.js";
import cors from 'cors';


dotenv.config();


// console.log(process.env.MONGODB_URL);

await connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

// Rate Limiting for all /api endpoints (IP-based)
const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: 'Too many signup attempts from this IP, please try again after 15 minutes',
});

// Apply rate limiting and custom delay to all /api routes
app.use('/api/auth', ipRateLimiter, applySignupDelay);

// Mount auth routes
app.use('/api', authRoutes);
app.use('/api', storyRoute);


const { port } = env;
app.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
});



app.use('/api/volunteer', volunteerRoutes);
app.use('/api/auth', authRoutes);