import { loginApi, logoutApi } from "@/services/auth-api";
import type { Store } from "@/types/store";
import type { AuthSlice, LoginCredentials } from "@/types/store/auth";
import type { StateCreator } from "zustand";

export const createAuthSlice: StateCreator<
    Store,
    [["zustand/devtools", never], ["zustand/persist", unknown], ["zustand/immer", never]],
    [],
    AuthSlice
> = (set) => ({
    user: null,
    role: null,
    outlet: null,
    accessToken: null,
    isLoading: false,

    login: async (credentials: LoginCredentials) => {
        set((state) => {
            state.isLoading = true;
        }, false, "auth/login/pending");

        try {
            const data = await loginApi(credentials);

            set((state) => {
                state.user = data.user;
                state.role = data.user?.role || null;
                state.accessToken = data.accessToken;
                state.isLoading = false;
            }, false, "auth/login/fulfilled");
        } catch (error) {
            set((state) => {
                state.isLoading = false;
            }, false, "auth/login/rejected");
            throw error;
        }
    },

    setUser: (user) =>
        set((state) => {
            state.user = user;
            state.role = user?.role || null;
            state.isLoading = false;
        }, false, "auth/setUser"),

    setRole: (role) =>
        set((state) => {
            state.role = role;
        }, false, "auth/setRole"),

    setOutlet: (outlet) =>
        set((state) => {
            state.outlet = outlet;
        }, false, "auth/setOutlet"),

    setAccessToken: (token) =>
        set((state) => {
            state.accessToken = token;
        }, false, "auth/setAccessToken"),

    setIsLoading: (isLoading) =>
        set((state) => {
            state.isLoading = isLoading;
        }, false, "auth/setIsLoading"),

    logout: async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            set((state) => {
                state.user = null;
                state.role = null;
                state.outlet = null;
                state.accessToken = null;
                state.isLoading = false;
            }, false, "auth/logout");
        }
    },
});