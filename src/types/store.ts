import type { AuthSlice } from "./store/auth";
import type { CartSlice } from "./store/cart";

export type Store = AuthSlice & CartSlice;