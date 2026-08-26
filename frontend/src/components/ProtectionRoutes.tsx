import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (token && user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, token, isLoading } = useAuth();

  // While we're still checking localStorage/profile on app load, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the actual page
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, token, isLoading } = useAuth();

  // While we're still checking localStorage/profile on app load, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin — send them to their own dashboard, not an error page
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in and an admin — render the actual page
  return <>{children}</>;
};
