import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Address, Order, OrderItem } from "@/types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  addresses: Address[];
  orders: Order[];
  isLoading: boolean;

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, phone: string, email: string) => Promise<boolean>;
  
  // Address actions
  addAddress: (address: Omit<Address, "id" | "userId">) => Promise<boolean>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;

  // Order actions
  addOrder: (order: Omit<Order, "id" | "userId" | "createdAt" | "updatedAt" | "items"> & { items: Omit<OrderItem, "id">[] }) => Promise<Order | null>;
  syncOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      addresses: [],
      orders: [],
      isLoading: false,

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Login failed");

          const user = data.user;
          set({
            currentUser: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              image: user.image,
            },
            addresses: user.addresses || [],
            orders: user.orders || [],
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error("Login action error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      signup: async (name, email, password, phone) => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, phone }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Signup failed");

          // Automatically log in the user after successful signup
          set({ isLoading: false });
          return await get().login(email, password);
        } catch (error) {
          console.error("Signup action error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, addresses: [], orders: [] });
      },

      updateProfile: async (name, phone, email) => {
        try {
          const current = get().currentUser;
          if (!current) return false;

          const res = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current.id, name, phone, email }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Profile update failed");

          set({
            currentUser: {
              ...current,
              name: data.user.name,
              phone: data.user.phone,
              email: data.user.email,
            },
          });
          return true;
        } catch (error) {
          console.error("Update profile action error:", error);
          return false;
        }
      },

      addAddress: async (addressData) => {
        try {
          const current = get().currentUser;
          if (!current) return false;

          const res = await fetch("/api/auth/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current.id, ...addressData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to add address");

          // Sync local state
          const newAddress = data.address;
          let updatedAddresses = [...get().addresses];
          if (newAddress.isDefault) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.userId === current.id ? { ...a, isDefault: false } : a
            );
          }
          set({ addresses: [...updatedAddresses, newAddress] });
          return true;
        } catch (error) {
          console.error("Add address action error:", error);
          return false;
        }
      },

      updateAddress: async (id, addressData) => {
        try {
          const current = get().currentUser;
          if (!current) return false;

          const res = await fetch("/api/auth/addresses", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId: current.id, ...addressData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to update address");

          const updatedAddress = data.address;
          let updatedAddresses = get().addresses.map((a) =>
            a.id === id ? updatedAddress : a
          );

          if (updatedAddress.isDefault) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.id !== id && a.userId === current.id ? { ...a, isDefault: false } : a
            );
          }

          set({ addresses: updatedAddresses });
          return true;
        } catch (error) {
          console.error("Update address action error:", error);
          return false;
        }
      },

      deleteAddress: async (id) => {
        try {
          const current = get().currentUser;
          if (!current) return false;

          const res = await fetch(`/api/auth/addresses?id=${id}&userId=${current.id}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to delete address");
          }

          // Sync local state
          const filtered = get().addresses.filter((a) => a.id !== id);
          const remainingForUser = filtered.filter((a) => a.userId === current.id);
          
          // If we deleted default, set the first remaining as default (matches backend logic)
          const deletedAddress = get().addresses.find((a) => a.id === id);
          if (deletedAddress?.isDefault && remainingForUser.length > 0) {
            remainingForUser[0].isDefault = true;
          }

          set({ addresses: filtered });
          return true;
        } catch (error) {
          console.error("Delete address action error:", error);
          return false;
        }
      },

      setDefaultAddress: async (id) => {
        try {
          const current = get().currentUser;
          if (!current) return false;

          const res = await fetch("/api/auth/addresses", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId: current.id }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to set default address");

          const updated = get().addresses.map((a) => {
            if (a.userId === current.id) {
              return { ...a, isDefault: a.id === id };
            }
            return a;
          });

          set({ addresses: updated });
          return true;
        } catch (error) {
          console.error("Set default address action error:", error);
          return false;
        }
      },

      addOrder: async (orderData) => {
        try {
          const current = get().currentUser;
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current?.id || null, ...orderData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to place order");

          const newOrder = data.order;
          // Prepend new order to local orders state
          set({ orders: [newOrder, ...get().orders] });
          return newOrder;
        } catch (error) {
          console.error("Add order action error:", error);
          return null;
        }
      },

      syncOrders: async () => {
        try {
          const current = get().currentUser;
          if (!current) return;

          const res = await fetch(`/api/orders?userId=${current.id}`);
          const data = await res.json();
          if (res.ok && data.orders) {
            set({ orders: data.orders });
          }
        } catch (error) {
          console.error("Sync orders action error:", error);
        }
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id || o.number === id || o.trackingNumber === id);
      },
    }),
    {
      name: "trollfit-auth",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        addresses: state.addresses,
        orders: state.orders,
      }),
    }
  )
);
