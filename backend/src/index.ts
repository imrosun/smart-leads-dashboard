import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use(errorHandler);

// Establish database connection immediately (Mongoose automatically buffers model commands)
connectDB();

const PORT = process.env.PORT || 5000;

// Only start the Express listener when running locally/standalone (not inside Vercel's serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export the app instance for Vercel's serverless builder
export default app;

