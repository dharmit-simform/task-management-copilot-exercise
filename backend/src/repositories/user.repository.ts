import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User, SignupDto } from '../models/user.model';

export class UserRepository {
  private users: Map<string, User> = new Map();

  async create(signupDto: SignupDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    
    const user: User = {
      id: uuidv4(),
      email: signupDto.email.toLowerCase(),
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      password: hashedPassword,
      createdAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    const normalizedEmail = email.toLowerCase();
    return Array.from(this.users.values()).find(
      user => user.email === normalizedEmail
    );
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const userRepository = new UserRepository();
