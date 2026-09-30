import { User } from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LoginResponse extends ApiResponse<AuthData> {}

export interface RegisterResponse extends ApiResponse<AuthData> {}

