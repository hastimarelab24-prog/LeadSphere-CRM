import React from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const loaction = useLocation();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-500 " />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: loaction }} />;
  }
  return <Outlet />;
}
