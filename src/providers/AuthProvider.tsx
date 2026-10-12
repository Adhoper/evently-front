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

import {
  getMyStaffEvents,
} from "../services/staffService";

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

  const [hasStaffAccess, setHasStaffAccess] =
    useState(false);

  const refreshStaffAccess =
    async () => {
      try {
        const assignedEvents =
          await getMyStaffEvents();

        setHasStaffAccess(
          assignedEvents.length > 0
        );
      } catch (error) {
        console.error(
          "No fue posible consultar los eventos asignados.",
          error
        );

        setHasStaffAccess(false);
      }
    };

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

          try {
            const assignedEvents =
              await getMyStaffEvents();

            setHasStaffAccess(
              assignedEvents.length > 0
            );
          } catch (staffError) {
            console.error(
              "No fue posible consultar los eventos asignados.",
              staffError
            );

            setHasStaffAccess(false);
          }
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
          setHasStaffAccess(false);
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

    await refreshStaffAccess();
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

    setHasStaffAccess(false);
  };

  const logout = () => {
    localStorage.removeItem(
      "evently_token"
    );

    setToken(null);
    setUser(null);
    setHasStaffAccess(false);
  };

  const becomeOrganizerUser =
    async () => {
      const response =
        await becomeOrganizer();
      saveSession(
        response.token,
        response.user
      );

      await refreshStaffAccess();
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated:
          user !== null,
        hasStaffAccess,
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