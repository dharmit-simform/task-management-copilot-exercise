export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
}

export interface SignupDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
