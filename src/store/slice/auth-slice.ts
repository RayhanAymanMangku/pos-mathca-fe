import { loginApi } from "@/services/auth-api";
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
    token: null,
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
                state.token = data.token;
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

    setToken: (token) =>
        set((state) => {
            state.token = token;
        }, false, "auth/setToken"),

    setIsLoading: (isLoading) =>
        set((state) => {
            state.isLoading = isLoading;
        }, false, "auth/setIsLoading"),

    logout: () =>
        set((state) => {
            state.user = null;
            state.role = null;
            state.outlet = null;
            state.token = null;
            state.isLoading = false;
        }, false, "auth/logout"),
});