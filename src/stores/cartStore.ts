import { create } from 'zustand';
import type { CartItem, ContainerCartItem } from '../types';

interface CartState {
  cart: CartItem[];
  containerCart: ContainerCartItem[];
  returnTrolleyEnabled: boolean;
  addToCart: (item: CartItem) => void;
  updateCartQty: (subSkuTypeId: string, qty: number) => void;
  removeFromCart: (subSkuTypeId: string) => void;
  clearCart: () => void;
  setContainerCart: (items: ContainerCartItem[]) => void;
  clearContainerCart: () => void;
  setReturnTrolley: (val: boolean) => void;
  clearAll: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  containerCart: [],
  returnTrolleyEnabled: true,

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.subSkuTypeId === item.subSkuTypeId);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.subSkuTypeId === item.subSkuTypeId
              ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQty) }
              : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),

  updateCartQty: (subSkuTypeId, qty) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.subSkuTypeId === subSkuTypeId ? { ...i, quantity: qty } : i
      ),
    })),

  removeFromCart: (subSkuTypeId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.subSkuTypeId !== subSkuTypeId),
    })),

  clearCart: () => set({ cart: [] }),

  setContainerCart: (items) => set({ containerCart: items }),

  clearContainerCart: () => set({ containerCart: [] }),

  setReturnTrolley: (val) => set({ returnTrolleyEnabled: val }),

  clearAll: () => set({ cart: [], containerCart: [], returnTrolleyEnabled: true }),
}));
