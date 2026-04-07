import { useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

export const useAuth = () => {
    return useStore(useShallow((state) => ({
        user: state.user,
        role: state.role,
        isLoading: state.isLoading,
        setUser: state.setUser,
        setRole: state.setRole,
        logout: state.logout,
    })));
};