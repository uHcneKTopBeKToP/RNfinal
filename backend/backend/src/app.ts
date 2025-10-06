import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import violationRoutes from './routes/violation.routes';

const app = express();

app.use(cors());
app.use(express.json());

// маршруты
app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);

export default app;
