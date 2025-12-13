import apiClient from '@/lib/axios';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  LogoutRequest,
  User,
} from '@/types/auth';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/register', data);
    return response.data;
  },

  /**
   * Login user and get tokens
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/login', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/refresh', data);
    return response.data;
  },

  /**
   * Logout and revoke refresh token
   */
  async logout(data: LogoutRequest): Promise<void> {
    await apiClient.post('/logout', data);
  },

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<void> {
    await apiClient.post('/logout-all');
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/profile');
    return response.data;
  },
};

