"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Truck,
  HelpCircle,
  Save,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

type TabType = "orders" | "addresses" | "settings";

export default function ProfilePage() {
  const router = useRouter();
  const {
    currentUser,
    isAuthenticated,
    logout,
    updateProfile,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
    syncOrders
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Address Modal / Form State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrValue, setAddrValue] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, router]);

  // Load user profile details on load
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || "");
      setProfilePhone(currentUser.phone || "");
      setProfileEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Sync orders from database on load
  useEffect(() => {
    if (isAuthenticated) {
      syncOrders();
    }
  }, [isAuthenticated, syncOrders]);

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const userAddresses = addresses.filter((a) => a.userId === currentUser.id);
  const userOrders = orders;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    updateProfile(profileName, profilePhone, profileEmail);
    setIsEditingProfile(false);
    toast.success("Profile updated successfully! ✨");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrValue || !addrCity) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        name: addrName,
        phone: addrPhone,
        address: addrValue,
        city: addrCity,
        isDefault: addrDefault,
      });
      toast.success("Address updated!");
    } else {
      addAddress({
        name: addrName,
        phone: addrPhone,
        address: addrValue,
        city: addrCity,
        isDefault: addrDefault,
      });
      toast.success("Address added!");
    }

    // Reset Form
    setIsAddressFormOpen(false);
    setEditingAddressId(null);
    setAddrName("");
    setAddrPhone("");
    setAddrValue("");
    setAddrCity("");
    setAddrDefault(false);
  };

  const openEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrValue(addr.address);
    setAddrCity(addr.city);
    setAddrDefault(addr.isDefault);
    setIsAddressFormOpen(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">My Account</span>
            <h1 className="mt-1 text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Yo, {currentUser.name || "Drip Lord"}!
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your orders, addresses, and account credentials.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 self-start rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="flex flex-row gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {[
              { id: "orders", label: "Order History", icon: Package },
              { id: "addresses", label: "Address Book", icon: MapPin },
              { id: "settings", label: "Profile Settings", icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 shrink-0 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                      : "border border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wide">Order History</h2>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {userOrders.length} {userOrders.length === 1 ? "order" : "orders"}
                    </span>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                      <div className="mb-4 rounded-full bg-muted p-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold">No orders yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your checkout items will show up here.
                      </p>
                      <button
                        onClick={() => router.push("/shop")}
                        className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Browse Shop
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => {
                        const statusColors: Record<string, string> = {
                          PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                          CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                          PROCESSING: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                          SHIPPED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                          DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
                          RETURNED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        };

                        const StatusIcon = {
                          PENDING: Clock,
                          CONFIRMED: Clock,
                          PROCESSING: Clock,
                          SHIPPED: Truck,
                          DELIVERED: CheckCircle,
                          CANCELLED: HelpCircle,
                          RETURNED: HelpCircle,
                        }[order.status] || HelpCircle;

                        return (
                          <div
                            key={order.id}
                            className="overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors hover:bg-card/75"
                          >
                            {/* Order Header */}
                            <div className="flex flex-col gap-4 border-b border-border bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-xs font-bold text-muted-foreground">ORDER ID</p>
                                <p className="text-sm font-black text-foreground">{order.number}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-muted-foreground">DATE PLACED</p>
                                <p className="text-sm font-medium">
                                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-muted-foreground">TOTAL PRICE</p>
                                <p className="text-sm font-black text-primary">
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {order.status}
                              </div>
                            </div>

                            {/* Order Items & Info */}
                            <div className="p-6">
                              <div className="divide-y divide-border">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-muted relative">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                          Fits
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="text-sm font-bold leading-tight">{item.name}</h4>
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        Size: {item.size} {item.color && `| Color: ${item.color}`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold">{formatPrice(item.price)}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Shipping summary */}
                              <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground grid gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="font-bold text-foreground mb-1 uppercase tracking-wider">Shipping Details</p>
                                  <p className="text-foreground">{order.shippingName}</p>
                                  <p>{order.shippingAddress}, {order.shippingCity}</p>
                                  <p>{order.shippingPhone}</p>
                                </div>
                                <div className="sm:text-right">
                                  <p className="font-bold text-foreground mb-1 uppercase tracking-wider">Tracking</p>
                                  {order.trackingNumber ? (
                                    <div>
                                      <p className="text-foreground font-mono font-semibold">{order.trackingNumber}</p>
                                      <button
                                        onClick={() => router.push(`/track-order?order=${order.trackingNumber}`)}
                                        className="mt-1.5 inline-flex items-center gap-1 font-bold text-primary hover:underline"
                                      >
                                        Track Parcel <ChevronRight className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <p>Will be provided upon dispatch.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wide">Address Book</h2>
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setAddrName(currentUser.name || "");
                        setAddrPhone(currentUser.phone || "");
                        setAddrValue("");
                        setAddrCity("");
                        setAddrDefault(userAddresses.length === 0);
                        setIsAddressFormOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Address
                    </button>
                  </div>

                  {/* Inline Address Form */}
                  {isAddressFormOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                          {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
                        </h3>
                        <button
                          onClick={() => setIsAddressFormOpen(false)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddressSubmit} className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recipient Name</label>
                          <input
                            required
                            type="text"
                            value={addrName}
                            onChange={(e) => setAddrName(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Phone</label>
                          <input
                            required
                            type="tel"
                            value={addrPhone}
                            onChange={(e) => setAddrPhone(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Address</label>
                          <input
                            required
                            type="text"
                            value={addrValue}
                            onChange={(e) => setAddrValue(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                          <input
                            required
                            type="text"
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id="default-chk"
                            checked={addrDefault}
                            onChange={(e) => setAddrDefault(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <label htmlFor="default-chk" className="text-xs font-bold text-muted-foreground cursor-pointer select-none">
                            Set as default shipping address
                          </label>
                        </div>

                        <div className="flex gap-2 sm:col-span-2 pt-4 justify-end border-t border-border">
                          <button
                            type="button"
                            onClick={() => setIsAddressFormOpen(false)}
                            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold hover:bg-muted"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save Address
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {userAddresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                      <p className="text-sm text-muted-foreground">No addresses saved. Add one to speed up checkout! 🚀</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {userAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`relative rounded-2xl border bg-card/30 p-6 flex flex-col justify-between ${
                            addr.isDefault ? "border-primary/50 bg-primary/5" : "border-border"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-sm">{addr.name}</span>
                              {addr.isDefault && (
                                <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{addr.address}</p>
                            <p className="text-xs font-medium text-foreground mt-1">{addr.city}</p>
                            <p className="text-xs text-muted-foreground mt-2">{addr.phone}</p>
                          </div>

                          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                            <button
                              onClick={() => openEditAddress(addr)}
                              className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-3 w-3" /> Edit
                            </button>
                            {!addr.isDefault && (
                              <>
                                <button
                                  onClick={() => setDefaultAddress(addr.id)}
                                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                                >
                                  Make Default
                                </button>
                                <button
                                  onClick={() => {
                                    deleteAddress(addr.id);
                                    toast.success("Address deleted!");
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 ml-auto"
                                >
                                  <Trash2 className="h-3 w-3" /> Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-bold uppercase tracking-wide">Profile Settings</h2>
                  </div>

                  <form onSubmit={handleSaveProfile} className="max-w-md rounded-2xl border border-border bg-card/20 p-6 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                      <input
                        required
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                      <input
                        required
                        type="email"
                        disabled={!isEditingProfile}
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                      <input
                        type="tel"
                        disabled={!isEditingProfile}
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                      />
                    </div>

                    <div className="flex gap-2 pt-4 justify-end border-t border-border mt-6">
                      {isEditingProfile ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileName(currentUser.name || "");
                              setProfilePhone(currentUser.phone || "");
                              setProfileEmail(currentUser.email || "");
                              setIsEditingProfile(false);
                            }}
                            className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold hover:bg-muted"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save Settings
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </main>
  );
}
