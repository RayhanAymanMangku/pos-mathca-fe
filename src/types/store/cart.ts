import type { Product } from "../product";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartSlice {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}
