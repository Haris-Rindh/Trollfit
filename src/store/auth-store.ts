import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Address, Order, OrderItem } from "@/types";
import toast from "react-hot-toast";

async function sha256(message: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    // Basic fallback for server environments if store runs during SSR
    return message; 
  }
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  addresses: Address[];
  orders: Order[];
  isLoading: boolean;

  // Local fallback storage
  localUsers: (User & { passwordHash?: string })[];
  localAddresses: Address[];
  localOrders: Order[];

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string, email: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  
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

      // Initialize local fallback state with SHA-256 hashes instead of plaintext passwords
      localUsers: [
        {
          id: "usr-guest",
          name: "Guest Drip Lord",
          email: "guest@trollfit.pk",
          phone: "0300 1234567",
          role: "CUSTOMER",
          passwordHash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // SHA-256 of password123
        },
        {
          id: "usr-admin",
          name: "Admin Drip Lord",
          email: "admin@trollfit.pk",
          phone: "0311 7654321",
          role: "ADMIN",
          passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // SHA-256 of admin123
        }
      ],
      localAddresses: [
        {
          id: "addr-guest",
          userId: "usr-guest",
          name: "Guest Drip Lord",
          phone: "0300 1234567",
          address: "House 42, Street 3, Block 5, Clifton",
          city: "Karachi",
          isDefault: true,
        }
      ],
      localOrders: [],

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          
          if (res.status === 401) {
            throw new Error("INVALID_CREDENTIALS");
          }

          if (!res.ok) {
            throw new Error("DATABASE_DOWN");
          }

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
        } catch (error: any) {
          console.warn("Auth Login API failed, fallback to local storage:", error.message);
          
          if (error.message === "INVALID_CREDENTIALS") {
            toast.error("Invalid email or password!");
            set({ isLoading: false });
            return false;
          }

          // Local Database Fallback
          const matchingUser = get().localUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          const inputHash = password ? await sha256(password) : "";

          if (matchingUser && matchingUser.passwordHash === inputHash) {
            const userAddresses = get().localAddresses.filter((a) => a.userId === matchingUser.id);
            const userOrders = get().localOrders.filter((o) => o.userId === matchingUser.id);
            
            set({
              currentUser: {
                id: matchingUser.id,
                name: matchingUser.name,
                email: matchingUser.email,
                phone: matchingUser.phone,
                role: matchingUser.role,
              },
              addresses: userAddresses,
              orders: userOrders,
              isAuthenticated: true,
              isLoading: false,
            });
            toast.success(`Logged in via Local Mode (Offline) 🌐`);
            return true;
          }

          toast.error("Invalid credentials or user not found!");
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
          if (res.status === 400 && data.error?.includes("already exists")) {
            throw new Error("EMAIL_ALREADY_REGISTERED");
          }
          if (!res.ok) throw new Error("DATABASE_DOWN");

          set({ isLoading: false });
          return await get().login(email, password);
        } catch (error: any) {
          console.warn("Auth Signup API failed, fallback to local storage:", error.message);

          if (error.message === "EMAIL_ALREADY_REGISTERED") {
            toast.error("Email address is already registered!");
            set({ isLoading: false });
            return false;
          }

          // Local Database Fallback
          const emailExists = get().localUsers.some(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (emailExists) {
            toast.error("Email address is already registered!");
            set({ isLoading: false });
            return false;
          }

          const newId = `usr-${Date.now()}`;
          const passHash = password ? await sha256(password) : "";
          const newUser = {
            id: newId,
            name,
            email,
            phone,
            role: "CUSTOMER" as const,
            passwordHash: passHash,
          };

          const newAddress: Address = {
            id: `addr-${Date.now()}`,
            userId: newId,
            name,
            phone: phone || "",
            address: "",
            city: "",
            isDefault: true,
          };

          set({
            localUsers: [...get().localUsers, newUser],
            localAddresses: [...get().localAddresses, newAddress],
            currentUser: {
              id: newId,
              name,
              email,
              phone,
              role: "CUSTOMER",
            },
            addresses: [newAddress],
            orders: [],
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Account created successfully in Local Mode! 🌐");
          return true;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
          console.warn("Logout endpoint failed:", error);
        }
        set({ currentUser: null, isAuthenticated: false, addresses: [], orders: [] });
      },

      checkSession: async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              set({
                currentUser: data.user,
                isAuthenticated: true,
                addresses: data.user.addresses || [],
                orders: data.user.orders || [],
              });
              return;
            }
          }
          // Clear if session is invalid or missing
          set({ currentUser: null, isAuthenticated: false, addresses: [], orders: [] });
        } catch (error) {
          console.warn("Failed to check session state:", error);
        }
      },

      updateProfile: async (name, phone, email) => {
        const current = get().currentUser;
        if (!current) return false;
        try {

          const res = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current.id, name, phone, email }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error("DATABASE_DOWN");

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
          console.warn("Update profile API failed, local update executed");
          
          const updatedUser = { ...current, name, phone, email };
          set({
            currentUser: updatedUser,
            localUsers: get().localUsers.map((u) => (u.id === current.id ? { ...u, name, phone, email } : u)),
          });
          return true;
        }
      },

      addAddress: async (addressData) => {
        const current = get().currentUser;
        if (!current) return false;
        try {
          const res = await fetch("/api/auth/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current.id, ...addressData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error("DATABASE_DOWN");

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
          console.warn("Add address API failed, local fallback executed");
          
          const newId = `addr-${Date.now()}`;
          const newAddress: Address = {
            ...addressData,
            id: newId,
            userId: current.id,
            isDefault: addressData.isDefault || get().addresses.filter(a => a.userId === current.id).length === 0,
          };

          let updatedAddresses = [...get().addresses];
          if (newAddress.isDefault) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.userId === current.id ? { ...a, isDefault: false } : a
            );
          }

          const allAddresses = [...updatedAddresses, newAddress];
          set({
            addresses: allAddresses,
            localAddresses: [
              ...get().localAddresses.filter((a) => a.id !== newId),
              newAddress
            ]
          });
          return true;
        }
      },

      updateAddress: async (id, addressData) => {
        const current = get().currentUser;
        if (!current) return false;
        try {
          const res = await fetch("/api/auth/addresses", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId: current.id, ...addressData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error("DATABASE_DOWN");

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
          console.warn("Update address API failed, local fallback executed");
          
          let updatedAddresses = get().addresses.map((a) => {
            if (a.id === id) {
              return { ...a, ...addressData };
            }
            return a;
          });

          if (addressData.isDefault) {
            updatedAddresses = updatedAddresses.map((a) =>
              a.id !== id && a.userId === current.id ? { ...a, isDefault: false } : a
            );
          }

          set({
            addresses: updatedAddresses,
            localAddresses: get().localAddresses.map((a) => (a.id === id ? { ...a, ...addressData } : a))
          });
          return true;
        }
      },

      deleteAddress: async (id) => {
        const current = get().currentUser;
        if (!current) return false;
        try {
          const res = await fetch(`/api/auth/addresses?id=${id}&userId=${current.id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("DATABASE_DOWN");

          const filtered = get().addresses.filter((a) => a.id !== id);
          const remainingForUser = filtered.filter((a) => a.userId === current.id);
          
          const deletedAddress = get().addresses.find((a) => a.id === id);
          if (deletedAddress?.isDefault && remainingForUser.length > 0) {
            remainingForUser[0].isDefault = true;
          }

          set({ addresses: filtered });
          return true;
        } catch (error) {
          console.warn("Delete address API failed, local fallback executed");
          
          const filtered = get().addresses.filter((a) => a.id !== id);
          const remainingForUser = filtered.filter((a) => a.userId === current.id);
          const deletedAddress = get().addresses.find((a) => a.id === id);
          
          if (deletedAddress?.isDefault && remainingForUser.length > 0) {
            remainingForUser[0].isDefault = true;
          }

          set({
            addresses: filtered,
            localAddresses: get().localAddresses.filter((a) => a.id !== id)
          });
          return true;
        }
      },

      setDefaultAddress: async (id) => {
        const current = get().currentUser;
        if (!current) return false;
        try {
          const res = await fetch("/api/auth/addresses", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, userId: current.id }),
          });

          if (!res.ok) throw new Error("DATABASE_DOWN");

          const updated = get().addresses.map((a) => {
            if (a.userId === current.id) {
              return { ...a, isDefault: a.id === id };
            }
            return a;
          });

          set({ addresses: updated });
          return true;
        } catch (error) {
          console.warn("Set default address API failed, local fallback executed");
          
          const updated = get().addresses.map((a) => {
            if (a.userId === current.id) {
              return { ...a, isDefault: a.id === id };
            }
            return a;
          });

          set({
            addresses: updated,
            localAddresses: get().localAddresses.map((a) => {
              if (a.userId === current.id) {
                return { ...a, isDefault: a.id === id };
              }
              return a;
            })
          });
          return true;
        }
      },

      addOrder: async (orderData) => {
        const current = get().currentUser;
        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: current?.id || null, ...orderData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error("DATABASE_DOWN");

          const newOrder = data.order;
          set({ orders: [newOrder, ...get().orders] });
          return newOrder;
        } catch (error) {
          console.warn("Place order API failed, saving to local order history");
          
          const newOrder: Order = {
            ...orderData,
            id: `ord-${Date.now()}`,
            userId: current?.id || "usr-guest",
            subtotal: Number(orderData.subtotal),
            shipping: Number(orderData.shipping),
            discount: Number(orderData.discount),
            total: Number(orderData.total),
            items: orderData.items.map((item, idx) => ({
              ...item,
              id: `item-${idx}-${Date.now()}`,
              price: Number(item.price)
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set({
            orders: [newOrder, ...get().orders],
            localOrders: [newOrder, ...get().localOrders]
          });
          return newOrder;
        }
      },

      syncOrders: async () => {
        const current = get().currentUser;
        if (!current) return;
        try {
          const res = await fetch(`/api/orders?userId=${current.id}`);
          const data = await res.json();
          if (res.ok && data.orders) {
            set({ orders: data.orders });
          }
        } catch (error) {
          console.warn("Sync orders API failed, loading local orders history");
          const localUserOrders = get().localOrders.filter((o) => o.userId === current.id);
          set({ orders: localUserOrders });
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
        localUsers: state.localUsers,
        localAddresses: state.localAddresses,
        localOrders: state.localOrders,
      }),
    }
  )
);
