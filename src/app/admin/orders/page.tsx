"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Package,
  Calendar,
  User,
  MapPin,
  FileDown,
  ExternalLink,
  ChevronRight,
  Loader2,
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  size: string;
  color?: string;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  number: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string;
  trackingNumber?: string;
  couponCode?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Update state inside modal
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [modalPaymentStatus, setModalPaymentStatus] = useState("");
  const [modalTracking, setModalTracking] = useState("");

  const fetchOrders = async (querySearch = search, tab = statusTab) => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/orders", window.location.origin);
      if (tab !== "ALL") url.searchParams.append("status", tab);
      if (querySearch) url.searchParams.append("search", querySearch);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data.orders);
    } catch (err: any) {
      console.warn("Fetch orders API failed, loading from local state:", err);
      let localList = useAuthStore.getState().localOrders || [];
      
      if (tab !== "ALL") {
        localList = localList.filter((o) => o.status === tab);
      }

      if (querySearch) {
        const q = querySearch.toLowerCase();
        localList = localList.filter(
          (o) =>
            o.number.toLowerCase().includes(q) ||
            o.shippingName.toLowerCase().includes(q) ||
            o.shippingCity.toLowerCase().includes(q) ||
            o.shippingPhone.toLowerCase().includes(q)
        );
      }

      const formattedLocalList: Order[] = localList.map((o) => ({
        id: o.id,
        number: o.number,
        userId: o.userId,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping),
        discount: Number(o.discount),
        total: Number(o.total),
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        shippingName: o.shippingName,
        shippingPhone: o.shippingPhone,
        shippingAddress: o.shippingAddress,
        shippingCity: o.shippingCity,
        shippingNotes: o.shippingNotes,
        trackingNumber: o.trackingNumber,
        couponCode: o.couponCode,
        createdAt: o.createdAt.toString(),
        items: o.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: Number(item.price),
          image: item.image,
        })),
      }));

      setOrders(formattedLocalList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Check search URL parameters (e.g. if coming from dashboard detail link)
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearch(searchParam);
      fetchOrders(searchParam, "ALL");
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(search, statusTab);
  };

  const handleTabChange = (tab: string) => {
    setStatusTab(tab);
    fetchOrders(search, tab);
  };

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setModalStatus(order.status);
    setModalPaymentStatus(order.paymentStatus);
    setModalTracking(order.trackingNumber || "");
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: modalStatus,
          paymentStatus: modalPaymentStatus,
          trackingNumber: modalTracking,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      toast.success("Order updated successfully!");
      
      // Update local state lists
      setOrders(orders.map((o) => (o.id === selectedOrder.id ? data.order : o)));
      setSelectedOrder(data.order);
    } catch (err: any) {
      console.warn("Update order API failed, performing local fallback updates:", err);
      
      const localList = useAuthStore.getState().localOrders || [];
      const targetOrder = localList.find((o) => o.id === selectedOrder.id);
      
      if (targetOrder) {
        const updatedLocalOrder = {
          ...targetOrder,
          status: modalStatus as any,
          paymentStatus: modalPaymentStatus as any,
          trackingNumber: modalTracking,
          updatedAt: new Date(),
        };

        // Save back in store state
        useAuthStore.setState({
          localOrders: localList.map((o) => (o.id === selectedOrder.id ? updatedLocalOrder : o)),
          orders: useAuthStore.getState().orders.map((o) => (o.id === selectedOrder.id ? updatedLocalOrder : o)),
        });

        const viewOrder: Order = {
          ...selectedOrder,
          status: modalStatus,
          paymentStatus: modalPaymentStatus,
          trackingNumber: modalTracking,
        };

        toast.success("Saved changes locally (offline mode) 🌐");
        setOrders(orders.map((o) => (o.id === selectedOrder.id ? viewOrder : o)));
        setSelectedOrder(viewOrder);
      } else {
        toast.error("Failed to update order details");
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusTabs = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const statusColors: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    PROCESSING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    SHIPPED: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    DELIVERED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
    RETURNED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  };

  const paymentStatusColors: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-400/10",
    PAID: "text-emerald-400 bg-emerald-400/10",
    FAILED: "text-red-400 bg-red-400/10",
    REFUNDED: "text-zinc-400 bg-zinc-400/10",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Order Fulfilment</h1>
          <p className="text-muted-foreground mt-1">
            Track, confirm, ship, and complete customer orders in real-time.
          </p>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="space-y-4">
        {/* Horizontal scrollable status filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                statusTab === tab
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                  : "bg-[#0e0e11] border-white/5 text-muted-foreground hover:border-white/10 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order #, Name, Phone, or City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-[#0e0e11] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 px-5 text-sm font-bold text-white transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        </form>
      </div>

      {/* Orders Grid/Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0e0e11] overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Searching orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">
            No orders match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-white/[0.01]">
                  <th className="p-5">Order #</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Items</th>
                  <th className="p-5">Total</th>
                  <th className="p-5">Fulfillment</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-5 font-mono font-black text-white">{order.number}</td>
                    <td className="p-5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {order.shippingName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {order.shippingCity}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-xs text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-white">Rs. {order.total.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Via {order.paymentMethod}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusColors[order.status] || "text-white bg-white/10"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleOpenDetails(order)}
                        className="rounded-lg bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                      >
                        Fulfill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0e0e11] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black font-mono text-white flex items-center gap-2">
                    Fulfillment Panel: {selectedOrder.number}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1">
                {/* Status Updates Control Form */}
                <div className="grid gap-6 sm:grid-cols-3 bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Order Fulfillment
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-card p-2 text-xs font-bold outline-none focus:border-primary text-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Payment Status
                    </label>
                    <select
                      value={modalPaymentStatus}
                      onChange={(e) => setModalPaymentStatus(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-card p-2 text-xs font-bold outline-none focus:border-primary text-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-primary" /> Tracking Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TCS-1234567"
                      value={modalTracking}
                      onChange={(e) => setModalTracking(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-xs outline-none focus:border-primary text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      onClick={handleUpdateOrder}
                      disabled={updatingStatus}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-60"
                    >
                      {updatingStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Save Updates
                    </button>
                  </div>
                </div>

                {/* Items Ordered List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Items List
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => {
                      const isCustom = item.productId.startsWith("custom") || item.name.toLowerCase().includes("custom");
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border border-white/5 rounded-xl p-4 bg-[#09090b] gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover bg-card shrink-0 border border-white/5"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Size: <span className="font-bold text-white">{item.size}</span>
                                {item.color && (
                                  <> • Color: <span className="font-bold text-white">{item.color}</span></>
                                )}
                                {" • Qty: "}
                                <span className="font-bold text-white">{item.quantity}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-bold text-white text-sm">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>

                            {/* Print File Download option for Custom Designs */}
                            {isCustom && item.image && (
                              <a
                                href={item.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-primary transition-colors"
                                title="Download Print File"
                              >
                                <FileDown className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping & Billing Breakdown */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Shipping details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      Delivery Address
                    </h4>
                    <div className="border border-white/5 rounded-xl p-4 bg-[#09090b] text-xs space-y-2 leading-relaxed">
                      <p className="font-bold text-white text-sm">{selectedOrder.shippingName}</p>
                      <p className="text-muted-foreground">{selectedOrder.shippingAddress}</p>
                      <p className="text-white font-semibold">{selectedOrder.shippingCity}</p>
                      <p className="text-muted-foreground">Phone: <span className="text-white font-mono">{selectedOrder.shippingPhone}</span></p>
                      {selectedOrder.shippingNotes && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-amber-400">
                          <span className="font-black uppercase tracking-wider text-[9px] block mb-1">
                            Notes:
                          </span>
                          {selectedOrder.shippingNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment invoice breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      Billing Summary
                    </h4>
                    <div className="border border-white/5 rounded-xl p-4 bg-[#09090b] text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-white">Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Courier</span>
                        <span className="font-bold text-white">Rs. {Number(selectedOrder.shipping).toLocaleString()}</span>
                      </div>
                      {Number(selectedOrder.discount) > 0 && (
                        <div className="flex justify-between text-red-400">
                          <span>Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                          <span>- Rs. {Number(selectedOrder.discount).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="h-px bg-white/5 my-2" />
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-white">Total Amount</span>
                        <span className="font-black text-primary">Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-white/5 my-2" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="font-bold text-white uppercase">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${paymentStatusColors[selectedOrder.paymentStatus] || "text-white"}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
