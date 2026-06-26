import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges — TrollFit",
  description:
    "TrollFit's 7-day return and exchange policy. We keep it simple so you can shop with confidence.",
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-24">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
            Returns &amp; Exchanges
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            We want you to love what you ordered. If something is off, we got
            you — our 7-day return policy makes it easy to sort things out.
          </p>
          <p className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
            Last updated: June 2025
          </p>
        </div>

        {/* Quick Summary Banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-12">
          <p className="text-primary font-bold text-lg mb-1">
            🕐 7-Day Return Window
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Returns must be initiated within{" "}
            <span className="text-foreground font-semibold">
              7 days of delivery
            </span>
            . Items must be unused, unworn, and in original packaging with tags
            attached. WhatsApp us to get started — it takes 2 minutes.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* What Can Be Returned */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">✅ What Can Be Returned</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We accept returns on items that meet ALL of the following conditions:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Item is unused, unworn, and in original condition",
                "All original tags are still attached",
                "Item is in its original packaging",
                "Return is initiated within 7 days of delivery",
                "You have the order confirmation or invoice handy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If your item arrived damaged, defective, or was the wrong item entirely — we will cover
              return shipping and issue a full refund or replacement. No questions asked.
            </p>
          </div>

          {/* What Cannot Be Returned */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">❌ What Cannot Be Returned</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              To maintain hygiene and quality standards, the following items are strictly non-returnable:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Items that have been washed, worn, or altered in any way",
                "Sale items or products purchased during a clearance event",
                "Items where tags have been removed",
                "Accessories (caps, socks, bags) for hygiene reasons",
                "Custom or personalised orders",
                "Items returned after the 7-day window has passed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">×</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We reserve the right to reject returns that do not meet our policy criteria. If a return
              is rejected, the item will be shipped back to the customer at their expense.
            </p>
          </div>

          {/* How to Initiate a Return */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">📲 How to Initiate a Return</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Returning an item is dead simple. Just hit us up on WhatsApp — no forms, no email chains.
            </p>
            <ol className="space-y-3 mb-4">
              {[
                "Message us on WhatsApp at +92 300 0000000 within 7 days of receiving your order",
                "Share your order number and a brief description of the issue",
                "Send clear photos of the item (front, back, and tags visible)",
                "Our team will respond within 24 hours with confirmed next steps",
                "Ship the item back to our warehouse address (provided by our team)",
              ].map((item, i) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Customer is responsible for return shipping costs unless the item is defective or
              incorrect. We recommend using a trackable courier service — TrollFit is not responsible
              for items lost in transit.
            </p>
          </div>

          {/* Exchange Process */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🔄 Exchange Process</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Need a different size or colour? Exchanges are easy. Here is how it works:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Contact us on WhatsApp and let us know what you would like instead",
                "Exchanges are subject to stock availability — we will confirm before you ship anything back",
                "Once we receive your returned item and verify its condition, we dispatch the replacement",
                "Exchange shipping is charged at standard rate (Rs. 200) unless the original item was defective",
                "Only one exchange is allowed per order",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">Pro tip:</span> Size up if you are
                between sizes — our fits run true to size but our hoodies are slightly slim cut.
                Check our size guide before ordering.
              </p>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">💸 Refund Timeline</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Once your return is received and inspected, here is what to expect:
            </p>
            <div className="space-y-3 mb-4">
              {[
                { label: "Inspection & approval", time: "1–2 business days after we receive the item" },
                { label: "Refund initiated", time: "Within 3 business days of approval" },
                { label: "Bank transfer / EasyPaisa / JazzCash", time: "3–5 business days to reflect in your account" },
                { label: "COD orders", time: "Refunded via bank transfer, EasyPaisa, or JazzCash — your choice" },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                  <span className="text-primary font-semibold text-sm flex-shrink-0 w-48">{row.label}</span>
                  <span className="text-muted-foreground text-sm">{row.time}</span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You will receive a WhatsApp confirmation at every stage of the refund process. If you
              have not received your refund after 7 business days, contact us immediately at{" "}
              <a href="mailto:support@trollfit.pk" className="text-primary hover:underline">
                support@trollfit.pk
              </a>
              .
            </p>
          </div>

        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Our support team is available 7 days a week, 10 AM – 10 PM PKT.
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
