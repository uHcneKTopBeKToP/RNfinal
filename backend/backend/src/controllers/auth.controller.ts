import type { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '../models/user.model';

const SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as User;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashed]);

  res.json(result.rows[0]);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as User;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!result.rows.length) return res.status(400).json({ message: 'User not found' });

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });
  res.json({ token });
};
