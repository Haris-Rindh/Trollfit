import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy — TrollFit",
  description:
    "TrollFit shipping info — standard, express, free shipping thresholds, COD, and estimated delivery times across Pakistan.",
};

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Abbottabad", "Sargodha", "Bahawalpur", "Sukkur",
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-24">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
            Shipping Policy
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            We ship all over Pakistan. Fast, reliable, and trackable — your fits
            are on their way the moment you place your order.
          </p>
          <p className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
            Last updated: June 2025
          </p>
        </div>

        {/* Shipping Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">

          {/* Standard */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2">
            <div className="text-2xl mb-1">📦</div>
            <h3 className="font-bold text-base">Standard Shipping</h3>
            <p className="text-primary font-black text-2xl">Rs. 200</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              3–5 business days. Available nationwide across Pakistan.
            </p>
          </div>

          {/* Express */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-2">
            <div className="text-2xl mb-1">⚡</div>
            <h3 className="font-bold text-base">Express Shipping</h3>
            <p className="text-primary font-black text-2xl">Rs. 400</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              1–2 business days. Available in major cities only.
            </p>
          </div>

          {/* Free */}
          <div className="bg-primary/10 border border-primary/40 rounded-2xl p-6 flex flex-col gap-2">
            <div className="text-2xl mb-1">🎉</div>
            <h3 className="font-bold text-base">Free Shipping</h3>
            <p className="text-primary font-black text-2xl">Rs. 0</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              On all orders above <span className="text-primary font-semibold">Rs. 3,000</span>. Standard timeline applies.
            </p>
          </div>

        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* Processing Time */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🕐 Order Processing Time</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              After you place your order, here is exactly what happens on our end:
            </p>
            <ol className="space-y-3">
              {[
                { step: "Order confirmed", desc: "You get a WhatsApp + email confirmation instantly" },
                { step: "Processing (1 business day)", desc: "We pick, pack, and quality-check your items before dispatch" },
                { step: "Handed to courier", desc: "Your parcel is dispatched with a tracking number sent to you via WhatsApp" },
                { step: "In transit", desc: "Courier delivers within 3–5 business days (standard) or 1–2 days (express)" },
                { step: "Delivered!", desc: "You receive your TrollFit fits. Tag us @trollfit.pk 📸" },
              ].map((item, i) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.step}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-400 font-semibold">Note:</span> Orders placed after
                5 PM or on Sundays and public holidays are processed the next business day.
                Delivery timelines are estimates and may vary during sale events or peak season.
              </p>
            </div>
          </div>

          {/* Cities Covered */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2">🗺️ Cities We Cover</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We deliver nationwide. Express shipping is available in the following major cities:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map((city) => (
                <span
                  key={city}
                  className="bg-primary/10 border border-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Not in the list above? No worries — standard shipping (3–5 business days) is
              available across all cities and towns in Pakistan including AJK, GB, and FATA regions.
              If you are unsure whether we deliver to your area, WhatsApp us before ordering.
            </p>
          </div>

          {/* COD */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">💵 Cash on Delivery (COD)</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Yes, we do COD! We know not everyone wants to pay online — and that is totally fine.
              Here is what you need to know:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "COD is available on all orders across Pakistan",
                "Pay cash to the courier upon delivery — no online payment needed",
                "COD orders may take 1 extra business day to process (manual verification)",
                "Our team may call or WhatsApp you to confirm your COD order before dispatch",
                "COD is not available on customised or pre-order items",
                "Please ensure someone is available at the delivery address to receive the parcel",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracking */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">📍 Order Tracking</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Once your order is dispatched, you will receive a tracking number via WhatsApp.
              You can track your parcel in real-time using the courier app or website.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Tracking number sent within 24 hours of dispatch",
                "We use TCS, Leopards Courier, and Call Courier — depending on your area",
                "Track directly on the courier's website using your provided tracking ID",
                "If you have not received a tracking number within 48 hours of ordering, contact us",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failed Deliveries */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">⚠️ Failed Deliveries & Unclaimed Parcels</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              If a delivery attempt fails (wrong address, nobody home, unreachable), the courier will
              try again up to 2 more times. After 3 failed attempts:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "The parcel is returned to TrollFit's warehouse",
                "We will contact you to arrange re-delivery (additional shipping charges apply)",
                "If you do not respond within 7 days, the order is cancelled — no refund on shipping fees",
                "For COD orders returned to us, we may charge a restocking fee of Rs. 150",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-0.5 flex-shrink-0 font-bold">!</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Always double-check your delivery address and phone number before placing an order.
              Small mistakes cause big delays!
            </p>
          </div>

        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Shipping questions? We got you.</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Reach out before or after ordering — we are here 10 AM – 10 PM PKT, 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              💬 WhatsApp Us
            </a>
            <a
              href="mailto:support@trollfit.pk"
              className="inline-flex items-center justify-center gap-2 bg-background border border-border text-foreground font-bold px-6 py-3 rounded-xl hover:border-primary/50 transition-colors text-sm"
            >
              ✉️ support@trollfit.pk
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
