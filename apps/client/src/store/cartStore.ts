import { create } from "zustand";
import { Product, ProductInCart } from "../types/interfaces";
import { persist, PersistOptions } from "zustand/middleware";

interface CartState {
  cart: ProductInCart[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

type CartPersist = PersistOptions<CartState>;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addItem: (product) =>
        set((state) => {
          const itemInCart = state.cart.find((item) => item.id === product.id);
          if (itemInCart) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => {
          const itemInCart = state.cart.find((item) => item.id === id);
          const itemQuantity = itemInCart?.quantity;
          if (itemQuantity && itemQuantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          }
          return {
            cart: state.cart.filter((item) => item.id !== id),
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
