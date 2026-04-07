import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { role, user } = useStore(useShallow((state) => ({
    role: state.role,
    user: state.user,
  })));

  const effectiveRole = role ?? user?.role ?? null;

  // Wait for role to be available if user is definitely logged in (re-hydration)
  if (effectiveRole === null && user !== null) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-800 border-t-transparent" />
          </div>
      );
  }

  // Redirect to POS if user is not an ADMIN
  if (effectiveRole !== "ADMIN") {
    return <Navigate to="/dashboard/pos" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
