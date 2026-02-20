import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.signup(req.body);

    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
