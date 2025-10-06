import type { Request, Response } from 'express';
import pool from '../config/db';
import type { Violation } from '../models/violation.model';

// Расширяем Request для добавления user
export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email?: string; // можно добавить другие поля при необходимости
  };
}

export const getViolations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM violations WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createViolation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { description, category, photo_url, latitude, longitude, date_time } =
      req.body as Violation;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO violations (description, category, photo_url, latitude, longitude, date_time, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [description, category, photo_url, latitude, longitude, date_time, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
