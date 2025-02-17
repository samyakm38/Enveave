import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteer.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(
  process.env.MONGODB_URL
).then(() => {
  console.log('Connected to MongoDB');
}
).catch((error) => {
  console.log('Error:', error);
});

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use('/api/volunteer', volunteerRoutes);
app.use('/api/auth', authRoutes);