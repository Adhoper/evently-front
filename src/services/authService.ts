import api from "../api/axios";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");

  return response.data;
};

export const becomeOrganizer = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/users/become-organizer");

  return response.data;
};
