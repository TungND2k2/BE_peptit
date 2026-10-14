import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from "cors";
import AppDataSource from './config/data-source';

dotenv.config();

const app = express();
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Peptit Elegance API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Liveness/readiness probe: 503 until the DB connection is up
app.get('/health', (req, res) => {
    const dbReady = AppDataSource.isInitialized;
    res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ok' : 'starting', db: dbReady });
});

// Routes
app.use("", routes);

export default app;
 