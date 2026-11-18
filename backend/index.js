
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';

// DNS Configuration
dns.setServers(['8.8.8.8', '8.8.4.4']);

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');
dotenv.config({ path: envPath });

const app = express();

const port = (process.env.PORT) || 4002;

// Middleware
app.use(express.json());
app.use(cors());

// Chatbot Routes
app.use('/bot/v1/', chatbotRoutes);

const startServer = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();
  if (!mongoUri) {
    throw new Error(`MONGO_URI is not configured. Add it to ${envPath}.`);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully.');

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exitCode = 1;
});
