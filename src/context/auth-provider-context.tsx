import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

export const AuthProviderContext = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useStore(useShallow((state) => ({
        user: state.user,
        isLoading: state.isLoading,
        // logout: state.logout,
    })));

    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = !!user;

    useEffect(() => {
        useStore.getState().setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const isDashboardRoute = location.pathname.startsWith('/dashboard');
        const isAuthRoute = location.pathname === '/';

        if (isDashboardRoute) {
            if (!isAuthenticated) {
                toast.dismiss();
                toast.info("Please login to continue");
                navigate('/', { replace: true });
                return;
            }
            return;
        }

        if (isAuthRoute && isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }

    }, [isAuthenticated, isLoading, location.pathname, navigate]);

    return <>{children}</>;
};

