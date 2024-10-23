import { create } from "zustand";
import { Product, ProductInCart, Size } from "../types/interfaces";
import { persist, PersistOptions } from "zustand/middleware";
import { matchIdAndSize } from "../lib/utils";

interface CartState {
  cart: ProductInCart[];
  addItem: (product: Product, size: Size) => void;
  removeItem: (product: Product, size: Size) => void;
  clearCart: () => void;
}

type CartPersist = PersistOptions<CartState>;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addItem: (product, size) =>
        set((state) => {
        
          const itemInCart = state.cart.find((item) => matchIdAndSize(item, product, size));
          if (itemInCart && itemInCart.size === size) {
            return {
              cart: state.cart.map((item) =>
                matchIdAndSize(item, product, size)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1, size: size }] };
        }),

      removeItem: (product, size) =>
        set((state) => {
          const itemInCart = state.cart.find((item) => matchIdAndSize(item, product, size));
          const itemQuantity = itemInCart?.quantity;
          if (itemQuantity && itemQuantity > 1) {
            return {
              cart: state.cart.map((item) =>
                matchIdAndSize(item, product, size) ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          }
          return {
            cart: state.cart.filter((item) => !matchIdAndSize(item, product, size)),
          }
        }),

      clearCart: () => set(() => ({ cart: [] })),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    } as CartPersist
  )
);
