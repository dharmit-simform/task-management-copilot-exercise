import jwt from 'jsonwebtoken';
import { SignupDto, LoginDto, AuthResponse, UserResponse } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  async signup(signupDto: SignupDto): Promise<AuthResponse> {
    const existingUser = userRepository.findByEmail(signupDto.email);
    
    if (existingUser) {
      const error: any = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.create(signupDto);
    const token = this.generateToken(user.id);

    return {
      user: this.mapToUserResponse(user),
      token
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = userRepository.findByEmail(loginDto.email);
    
    if (!user) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await userRepository.verifyPassword(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user.id);

    return {
      user: this.mapToUserResponse(user),
      token
    };
  }

  private generateToken(userId: string): string {
    const payload = { userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    };
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      const err: any = new Error('Invalid or expired token');
      err.statusCode = 401;
      throw err;
    }
  }
}

export const authService = new AuthService();
