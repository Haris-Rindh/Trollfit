import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartItemState {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItemState[];
  couponCode: string | null;
  couponDiscount: number;

  // Actions
  addItem: (product: Product, size: string, color?: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
}

function generateCartItemId(productId: string, size: string, color?: string): string {
  return `${productId}-${size}-${color || "default"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (product, size, color, quantity = 1) => {
        const id = generateCartItemId(product.id, size, color);
        const existingItem = get().items.find((item) => item.id === id);

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id,
                productId: product.id,
                product,
                size,
                color,
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      setCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.salePrice || item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      shipping: () => {
        const subtotal = get().subtotal();
        if (subtotal >= 3000) return 0; // Free shipping over Rs. 3000
        return 200; // Standard shipping Rs. 200
      },

      total: () => {
        const subtotal = get().subtotal();
        const shipping = get().shipping();
        const discount = get().couponDiscount;
        return subtotal + shipping - discount;
      },
    }),
    {
      name: "trollfit-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);
