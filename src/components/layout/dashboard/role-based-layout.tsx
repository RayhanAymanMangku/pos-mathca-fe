import React from "react";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";
import DashboardLayout from "./admin-layout";
import DriverLayout from "./driver-layout";
import { useOutletSync } from "@/hooks/use-outlet-sync";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children }) => {
  useOutletSync();
  const { role, user } = useStore(useShallow((state) => ({
    role: state.role,
    user: state.user,
  })));

  const effectiveRole = role ?? user?.role ?? null;

  if (effectiveRole === null && user === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-800 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (effectiveRole === 'ADMIN') {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <DriverLayout>{children}</DriverLayout>;
};

export default RoleBasedLayout;
