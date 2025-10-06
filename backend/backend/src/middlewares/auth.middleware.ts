import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'secret';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
