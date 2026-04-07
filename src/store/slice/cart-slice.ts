import type { StateCreator } from "zustand";
import type { Store } from "@/types/store";
import type { CartSlice } from "@/types/store/cart";
import type { Product } from "@/types/product";

export const createCartSlice: StateCreator<
    Store,
    [["zustand/devtools", never], ["zustand/persist", unknown], ["zustand/immer", never]],
    [],
    CartSlice
> = (set, get) => ({
    cart: [],
    
    addToCart: (product: Product) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({ product, quantity: 1 });
        }
    }),

    removeFromCart: (productId: string) => set((state) => {
        state.cart = state.cart.filter(item => item.product.id !== productId);
    }),

    updateQuantity: (productId: string, quantity: number) => set((state) => {
        const item = state.cart.find(item => item.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                state.cart = state.cart.filter(i => i.product.id !== productId);
            } else {
                item.quantity = quantity;
            }
        }
    }),

    clearCart: () => set((state) => {
        state.cart = [];
    }),

    getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.product.sellPrice * item.quantity), 0);
    },
});
