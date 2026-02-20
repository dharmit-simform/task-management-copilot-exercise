import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .transform(val => val.trim()),
    firstName: z
      .string({ message: 'First name is required' })
      .min(1, 'First name cannot be empty')
      .max(50, 'First name must be less than 50 characters')
      .transform(val => val.trim()),
    lastName: z
      .string({ message: 'Last name is required' })
      .min(1, 'Last name cannot be empty')
      .max(50, 'Last name must be less than 50 characters')
      .transform(val => val.trim()),
    password: z
      .string({ message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password must be less than 100 characters')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .transform(val => val.trim()),
    password: z
      .string({ message: 'Password is required' })
      .min(1, 'Password cannot be empty')
  })
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
