import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TrollFit",
  description:
    "TrollFit's privacy policy — how we collect, use, and protect your personal information when you shop with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-24">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Your privacy matters to us. This policy explains what data we collect,
            how we use it, and how we keep it safe. No jargon — just straight talk.
          </p>
          <p className="text-sm text-muted-foreground mt-4 border-t border-border pt-4">
            Last updated: June 2025
          </p>
        </div>

        {/* Intro */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 mb-12">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This Privacy Policy applies to{" "}
            <span className="text-foreground font-semibold">TrollFit</span> (operated by TrollFit
            Pakistan, referred to as &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By visiting our website or placing
            an order, you agree to the terms of this policy. If you have any questions or concerns,
            reach out at{" "}
            <a href="mailto:support@trollfit.pk" className="text-primary hover:underline">
              support@trollfit.pk
            </a>
            .
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* Information We Collect */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">📋 Information We Collect</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We only collect information that is necessary to process your orders and improve your
              shopping experience. Here is what we collect:
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Personal Information (when you place an order)</h3>
                <ul className="space-y-1.5">
                  {[
                    "Full name",
                    "Shipping address (city, area, street, postal code)",
                    "Phone number (used for delivery coordination)",
                    "Email address (for order confirmations)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Payment Information</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We do not store your payment card details. Online payments are processed through
                  secure third-party gateways (e.g., JazzCash, EasyPaisa, bank transfer). For COD
                  orders, no payment information is collected digitally.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Technical / Usage Data (automatically collected)</h3>
                <ul className="space-y-1.5">
                  {[
                    "IP address and approximate location",
                    "Browser type and device information",
                    "Pages visited, time spent, and clickstream data",
                    "Referring websites or search queries that brought you to us",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🛠️ How We Use Your Information</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We use your data solely for running our business and improving your experience.
              Specifically, we use it to:
            </p>
            <ul className="space-y-2">
              {[
                "Process and fulfil your orders (dispatch, tracking, delivery)",
                "Send order confirmations and shipping updates via WhatsApp and email",
                "Respond to your queries, complaints, and return/exchange requests",
                "Detect and prevent fraud or unauthorised activity",
                "Improve our website performance, product offerings, and user experience",
                "Send promotional content and new launch announcements (only if you opted in)",
                "Comply with applicable Pakistani laws and regulations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">We will never:</span> sell, rent, or
                trade your personal information to third parties for their marketing purposes.
                Your data stays with TrollFit.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🍪 Cookies & Tracking</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We use cookies and similar tracking technologies to make our website work better and to
              understand how people use it. Here is a breakdown:
            </p>
            <div className="space-y-4">
              {[
                {
                  type: "Essential Cookies",
                  desc: "Required for the website to function — shopping cart, login sessions, checkout process. Cannot be disabled.",
                  badge: "Required",
                  color: "bg-red-500/10 border-red-500/20 text-red-400",
                },
                {
                  type: "Analytics Cookies",
                  desc: "Help us understand which pages are popular and how customers navigate the site (Google Analytics). Anonymous data only.",
                  badge: "Optional",
                  color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                },
                {
                  type: "Marketing Cookies",
                  desc: "Used for targeted advertising on Meta (Instagram/Facebook) and Google Ads. Tracks what you view so we can show relevant ads.",
                  badge: "Optional",
                  color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                },
              ].map((cookie) => (
                <div key={cookie.type} className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">{cookie.type}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cookie.color}`}>
                        {cookie.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cookie.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              You can manage or disable optional cookies through your browser settings at any time.
              Note that disabling cookies may affect some website functionality.
            </p>
          </div>

          {/* Third Parties */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🤝 Third-Party Services</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              To operate our store, we work with trusted third-party service providers. Each of them
              has their own privacy policy governing how they handle data:
            </p>
            <div className="space-y-3">
              {[
                { name: "Courier Partners (TCS, Leopards, Call Courier)", use: "Delivery address and contact number to fulfil shipments" },
                { name: "Google Analytics", use: "Anonymous website usage data for analytics and performance monitoring" },
                { name: "Meta (Instagram / Facebook)", use: "Pixel tracking for advertising and remarketing campaigns" },
                { name: "JazzCash / EasyPaisa", use: "Payment processing — they handle all payment data securely" },
                { name: "WhatsApp Business", use: "Order updates, customer support, and return communications" },
              ].map((tp) => (
                <div key={tp.name} className="py-3 border-b border-border last:border-0">
                  <p className="text-sm font-semibold text-foreground mb-0.5">{tp.name}</p>
                  <p className="text-xs text-muted-foreground">{tp.use}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              We only share the minimum data necessary with these partners to deliver our service.
              We do not authorise them to use your information for their own marketing purposes.
            </p>
          </div>

          {/* Data Security */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">🔒 Data Security</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We take reasonable measures to protect your personal information from unauthorised
              access, disclosure, or misuse. Our security practices include:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "HTTPS encryption on all pages of our website",
                "Secure, access-controlled storage for order and customer data",
                "We do not store raw payment card numbers — ever",
                "Regular review of data handling processes and access permissions",
                "Limiting data access to authorised team members only",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No online system can be 100% secure. While we strive to protect your data, we cannot
              guarantee absolute security. If you suspect any unauthorised use of your information,
              please contact us immediately.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">⚖️ Your Rights</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              You have control over your personal information. You can:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Request a copy of all personal data we hold about you",
                "Ask us to correct inaccurate or outdated information",
                "Request deletion of your personal data (subject to legal obligations)",
                "Opt out of marketing emails or WhatsApp broadcasts at any time",
                "Withdraw consent for cookies and tracking (via browser settings)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:support@trollfit.pk" className="text-primary hover:underline">
                support@trollfit.pk
              </a>{" "}
              with the subject line &quot;Data Request&quot;. We will respond within 7 business days.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">👶 Children&apos;s Privacy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              TrollFit is not directed at children under the age of 13. We do not knowingly collect
              personal information from children. If you believe we have accidentally collected data
              from a child under 13, please contact us immediately at{" "}
              <a href="mailto:support@trollfit.pk" className="text-primary hover:underline">
                support@trollfit.pk
              </a>{" "}
              and we will delete it promptly.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-5">📝 Changes to This Policy</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We may update this Privacy Policy from time to time as our business evolves or
              applicable laws change. When we make changes:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "We will update the 'Last updated' date at the top of this page",
                "Significant changes will be announced via our Instagram (@trollfit.pk) or WhatsApp broadcast",
                "Continued use of our website after changes means you accept the updated policy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">→</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We recommend checking this page periodically to stay informed about how we protect
              your information.
            </p>
          </div>

        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-muted-foreground text-sm mb-2 max-w-md mx-auto">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how
            we handle your data, we are here to help.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            <span className="font-medium text-foreground">TrollFit Pakistan</span> —
            Email:{" "}
            <a href="mailto:support@trollfit.pk" className="text-primary hover:underline">
              support@trollfit.pk
            </a>
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
