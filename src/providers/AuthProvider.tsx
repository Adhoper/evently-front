import {
  useEffect,
  useState,
} from "react";

import {
  becomeOrganizer,
  getMe,
  login,
  register,
} from "../services/authService";

import {
  AuthContext,
} from "../contexts/authContext";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem(
        "evently_token"
      )
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const restoreSession =
      async () => {
        const storedToken =
          localStorage.getItem(
            "evently_token"
          );

        if (!storedToken) {
          setLoading(false);
          return;
        }

        try {
          const currentUser =
            await getMe();

          setUser(currentUser);
          setToken(storedToken);
        } catch (error) {
          console.error(
            "No fue posible restaurar la sesión.",
            error
          );

          localStorage.removeItem(
            "evently_token"
          );

          setUser(null);
          setToken(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, []);

  const saveSession = (
    newToken: string,
    newUser: User
  ) => {
    localStorage.setItem(
      "evently_token",
      newToken
    );

    setToken(newToken);
    setUser(newUser);
  };

  const loginUser = async (
    data: LoginRequest
  ) => {
    const response =
      await login(data);

    saveSession(
      response.token,
      response.user
    );
  };

  const registerUser = async (
    data: RegisterRequest
  ) => {
    const response =
      await register(data);

    saveSession(
      response.token,
      response.user
    );
  };

  const logout = () => {
    localStorage.removeItem(
      "evently_token"
    );

    setToken(null);
    setUser(null);
  };

  const becomeOrganizerUser =
    async () => {
      const response =
        await becomeOrganizer();

      // IMPORTANTE:
      // el backend genera un JWT nuevo
      // porque ahora Role = Organizer.
      saveSession(
        response.token,
        response.user
      );
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated:
          user !== null,
        loginUser,
        registerUser,
        logout,
        becomeOrganizerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;