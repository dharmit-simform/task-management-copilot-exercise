import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { userRepository } from '../repositories/user.repository';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid Bearer token.'
      });
      return;
    }

    const token = authHeader.substring(7);
    const { userId } = authService.verifyToken(token);

    const user = userRepository.findById(userId);
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found. Token may be invalid.'
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      status: 'error',
      message: error.message || 'Authentication failed'
    });
  }
};
