import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './src/config/db';
import apiRoutes from './src/routes/api';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: '*', // Allow Next.js frontend
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', apiRoutes);

// ensure the worker is imported and starts processing
import './src/queue/generateQueue';

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
