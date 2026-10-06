import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  LoaderCircle,
} from "lucide-react";

import {
  useAuth,
} from "../hooks/useAuth";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <LoaderCircle
            className="animate-spin text-brand-600"
            size={30}
          />

          <span className="text-sm font-semibold">
            Cargando Evently...
          </span>
        </div>
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

  if (
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/account"
        replace
      />
    );
  }

  return children;
}

export default RoleProtectedRoute;