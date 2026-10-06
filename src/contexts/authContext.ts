import {
  createContext,
} from "react";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  loginUser: (
    data: LoginRequest
  ) => Promise<void>;

  registerUser: (
    data: RegisterRequest
  ) => Promise<void>;

  logout: () => void;

  becomeOrganizerUser:
    () => Promise<void>;
}

export const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);