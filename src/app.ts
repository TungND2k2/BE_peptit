import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.json());

// Routes
app.use("", routes);

export default app;
