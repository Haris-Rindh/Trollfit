import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[]; // Product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      toggleItem: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "trollfit-wishlist",
    }
  )
);
