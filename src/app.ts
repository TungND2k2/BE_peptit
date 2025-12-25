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

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Peptit Elegance API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Routes
app.use("", routes);

export default app;
 