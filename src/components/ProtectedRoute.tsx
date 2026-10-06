import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-500">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;