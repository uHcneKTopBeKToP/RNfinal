import { Router, type RequestHandler } from 'express';
import { getViolations, createViolation } from '../controllers/violation.controller';
import { authenticate } from '../middlewares/auth.middleware';
import type { AuthenticatedRequest } from '../controllers/violation.controller';

const router = Router();

// Явно говорим TS, что handler — это RequestHandler с AuthenticatedRequest
router.get('/', authenticate, getViolations as unknown as RequestHandler);
router.post('/', authenticate, createViolation as unknown as RequestHandler);

export default router;
