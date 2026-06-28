"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  ArrowRight,
  Package,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  activeOrders: number;
  avgOrderValue: number;
}

interface OrderItemInfo {
  id: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
}

interface RecentOrder {
  id: string;
  number: string;
  shippingName: string;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  items: OrderItemInfo[];
}

interface StatusCount {
  status: string;
  count: number;
}

export default function AdminDashboard() {
  const { currentUser } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to load dashboard metrics");
        
        setMetrics(data.metrics);
        setRecentOrders(data.recentOrders);
        setStatusCounts(data.statusCounts);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
        <h3 className="text-lg font-bold">Failed to Load Dashboard</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Neon status colors dictionary
  const statusColors: Record<string, string> = {
    PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    PROCESSING: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    SHIPPED: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    DELIVERED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
    RETURNED: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  };

  const metricCards = [
    {
      title: "Total Revenue",
      value: `Rs. ${(metrics?.totalSales || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500 shadow-emerald-500/10",
      description: "Non-cancelled orders sum",
    },
    {
      title: "Total Orders",
      value: metrics?.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-primary to-accent shadow-primary/10",
      description: "Total checkout submissions",
    },
    {
      title: "Pending Fulfillment",
      value: metrics?.activeOrders || 0,
      icon: Clock,
      color: "from-amber-500 to-orange-500 shadow-amber-500/10",
      description: "Awaiting shipment/delivery",
    },
    {
      title: "Avg Order Value",
      value: `Rs. ${(metrics?.avgOrderValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500 shadow-blue-500/10",
      description: "Revenue divided by orders",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-white">{currentUser?.name}</span>. Here is how your store is performing today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#0e0e11] p-6 shadow-lg hover:border-white/10 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5`}>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-black tracking-tight">{card.value}</h2>
              <p className="text-xs text-muted-foreground mt-2">{card.description}</p>

              {/* Decorative accent blob */}
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Manage Orders <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0e0e11] overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No orders found in database yet. Place one on the storefront to test!
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-white">
                          {order.number}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusColors[order.status] || "text-white bg-white/10"}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Customer: <span className="font-semibold text-white">{order.shippingName}</span> •{" "}
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 sm:text-right shrink-0">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">Rs. {order.total.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Via {order.paymentMethod}
                        </p>
                      </div>
                      <Link
                        href={`/admin/orders?search=${order.number}`}
                        className="rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution (Smart SVG Chart) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Status Breakdown
          </h2>

          <div className="rounded-2xl border border-white/5 bg-[#0e0e11] p-6 space-y-6">
            {statusCounts.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No status data available.
              </div>
            ) : (
              <div className="space-y-4">
                {/* SVG Visual Representation */}
                <div className="h-40 w-full relative flex items-end justify-around border-b border-white/5 pb-2">
                  {statusCounts.map((group, index) => {
                    const maxVal = Math.max(...statusCounts.map((c) => c.count), 1);
                    const heightPercent = `${(group.count / maxVal) * 100}%`;
                    return (
                      <div key={group.status} className="flex flex-col items-center w-10 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded-md shadow-lg border border-border z-10">
                          {group.count}
                        </div>
                        {/* Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: heightPercent }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          className={`w-4 rounded-t-md bg-gradient-to-t from-primary/60 to-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]`}
                        />
                        <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-2 max-w-[40px] truncate text-center">
                          {group.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* List representation */}
                <div className="space-y-2 pt-2">
                  {statusCounts.map((group) => (
                    <div key={group.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="font-semibold text-muted-foreground uppercase">{group.status}</span>
                      </div>
                      <span className="font-bold text-white">{group.count} {group.count === 1 ? "order" : "orders"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
