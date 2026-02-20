import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validate(signupSchema), signup);

/**
 * @route   POST /auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

export default router;
