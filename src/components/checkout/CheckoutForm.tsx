"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";
import {
  Banknote,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Tag,
  CheckCircle2,
  X,
  Loader2,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Coupon codes ─────────────────────────────────────────

type CouponType = "percent" | "fixed";

interface Coupon {
  type: CouponType;
  value: number; // percent (0-100) or fixed PKR
  label: string;
}

const VALID_COUPONS: Record<string, Coupon> = {
  TROLL10: { type: "percent", value: 10, label: "10% OFF" },
  MEME20:  { type: "percent", value: 20, label: "20% OFF" },
  DRIP50:  { type: "fixed",   value: 50, label: "Rs. 50 OFF" },
  FIRST:   { type: "percent", value: 15, label: "15% OFF" },
};

// ─── CheckoutForm ──────────────────────────────────────────

export function CheckoutForm() {
  const router = useRouter();
  const {
    items,
    clearCart,
    setCoupon,
    removeCoupon,
    subtotal,
    couponCode,
    couponDiscount,
  } = useCartStore();

  const { currentUser, addresses, addOrder } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "SAFEPAY">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      
      const defaultAddr = addresses.find(
        (a) => a.userId === currentUser.id && a.isDefault
      );
      if (defaultAddr) {
        setAddress(defaultAddr.address);
        setCity(defaultAddr.city);
      }
    }
  }, [currentUser, addresses]);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ─── Submit order ───────────────────────────────────────

  const validatePhone = (p: string) => {
    const clean = p.replace(/[\s-]/g, "");
    return /^(\+92|0)?3\d{9}$/.test(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !city) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Please enter a valid Pakistani mobile number (e.g., 03001234567).");
      return;
    }

    setIsSubmitting(true);

    const sub = subtotal();
    const ship = sub >= 3000 ? 0 : 200;
    const disc = couponDiscount;
    const tot = sub + ship - disc;

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
    const orderNum = `TF-${dateStr}-${random}`;

    const orderItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: Number(item.product.salePrice || item.product.price),
      name: item.product.name,
      image: item.product.images[0],
    }));

    try {
      // Place order in database
      const placedOrder = await addOrder({
        number: orderNum,
        items: orderItems,
        subtotal: sub,
        shipping: ship,
        discount: disc,
        total: tot,
        status: paymentMethod === "COD" ? "PROCESSING" : "PENDING",
        paymentMethod: paymentMethod,
        paymentStatus: "PENDING",
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingNotes: notes || undefined,
        trackingNumber: orderNum,
        couponCode: couponCode || undefined,
      });

      if (!placedOrder) {
        throw new Error("Could not save the order. Please try again.");
      }

      if (paymentMethod === "SAFEPAY") {
        // Online Payment Flow: Create checkout session
        const payRes = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: tot, orderId: orderNum }),
        });

        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.error || "Failed to start payment gateway");

        // Clear cart and redirect to Safepay sandbox checkout portal
        clearCart();
        setIsSubmitting(false);
        toast.loading("Redirecting to secure payment portal...");
        window.location.href = payData.checkoutUrl;
      } else {
        // Cash on Delivery Flow
        setIsSubmitting(false);
        clearCart();
        toast.success("Order Placed Successfully! 🎉");
        router.push(`/order-success?number=${orderNum}`);
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      toast.error(err.message || "Failed to process checkout.");
      setIsSubmitting(false);
    }
  };

  // ─── Apply coupon ───────────────────────────────────────

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setIsApplyingCoupon(true);

    // Simulate a tiny async delay for realism
    setTimeout(() => {
      setIsApplyingCoupon(false);
      const coupon = VALID_COUPONS[code];

      if (!coupon) {
        toast.error("Invalid coupon code. Try TROLL10, MEME20, DRIP50 or FIRST 🤷");
        return;
      }

      const sub = subtotal();
      let discountAmount: number;

      if (coupon.type === "percent") {
        discountAmount = Math.round((sub * coupon.value) / 100);
      } else {
        discountAmount = coupon.value;
      }

      setCoupon(code, discountAmount);
      setCouponInput("");
      toast.success(`Coupon applied! You saved Rs. ${discountAmount.toLocaleString()} 🎉`);
    }, 600);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast("Coupon removed", { icon: "👋" });
  };

  const handleCouponKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApplyCoupon();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Contact & Shipping */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Information</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="text"
                placeholder="Ali Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="tel"
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Complete Address *
            </label>
            <textarea
              required
              rows={3}
              placeholder="House #, Street #, Phase/Block, Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-border bg-card p-4 outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              City *
            </label>
            <input
              required
              type="text"
              placeholder="Karachi, Lahore, Islamabad, etc."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Banknote className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Payment Method</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* COD */}
          <div
            onClick={() => setPaymentMethod("COD")}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
              paymentMethod === "COD"
                ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  paymentMethod === "COD" ? "border-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "COD" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <span className="font-bold">Cash on Delivery (COD)</span>
              </div>
              <Banknote className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Pay with cash directly to the rider upon receiving your parcel. No advance fee.
            </p>
          </div>

          {/* SAFEPAY */}
          <div
            onClick={() => setPaymentMethod("SAFEPAY")}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
              paymentMethod === "SAFEPAY"
                ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  paymentMethod === "SAFEPAY" ? "border-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "SAFEPAY" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <span className="font-bold">Pay Online (Cards/Wallets)</span>
              </div>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Secure payments powered by Safepay. Supports Visa, MasterCard, and local wallets.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Coupon Code Section ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Have a Coupon Code?</h2>
        </div>

        {/* Applied coupon badge */}
        <AnimatePresence>
          {couponCode && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">
                    {couponCode} applied!
                  </p>
                  <p className="text-xs text-emerald-400/70">
                    You're saving Rs. {couponDiscount.toLocaleString()} on this order 🎉
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-400/60 transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
                aria-label="Remove coupon"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input + Apply (hidden when coupon is active) */}
        <AnimatePresence>
          {!couponCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={handleCouponKeyDown}
                  placeholder="e.g. TROLL10"
                  maxLength={16}
                  className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 font-mono text-sm font-semibold tracking-widest outline-none transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponInput.trim()}
                className="flex min-w-[96px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplyingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint text */}
        {!couponCode && (
          <p className="text-xs text-muted-foreground">
            Got a promo code? Enter it above to unlock your discount. 🏷️
          </p>
        )}
      </section>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/30 py-3 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>Your information is safely encrypted and secure.</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground font-bold transition-all active:scale-[0.98] disabled:opacity-80"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
        ) : (
          `CONFIRM ORDER (Rs. ${(subtotal() + (subtotal() >= 3000 ? 0 : 200) - couponDiscount).toLocaleString()})`
        )}
      </button>
    </form>
  );
}
