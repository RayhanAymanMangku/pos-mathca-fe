import { create } from "zustand";
import type { Store } from "@/types/store";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createAuthSlice } from "./slice/auth-slice";
import { createCartSlice } from "./slice/cart-slice";

export const useStore = create<Store>()(
    devtools(
        persist(
            immer((...a) => ({
                ...createAuthSlice(...a),
                ...createCartSlice(...a),
            })),
            {
                name: "pos-matcha-storage",
                // Hanya persist field yang dibutuhkan, jangan persist isLoading
                partialize: (state) => ({
                    user: state.user,
                    role: state.user?.role ?? null,
                    accessToken: state.accessToken,
                    cart: state.cart,
                }),
                // Sinkronisasi role dari user ketika data di-rehydrate dari localStorage
                merge: (persistedState, currentState) => ({
                    ...currentState,
                    ...(persistedState as Partial<Store>),
                    // Selalu derive role dari persisted user agar konsisten
                    role: (persistedState as Partial<Store>)?.user?.role ?? null,
                    isLoading: false,
                }),
            }
        ),
        {
            name: "pos-matcha",
            enabled: import.meta.env.DEV,
        }
    )
);