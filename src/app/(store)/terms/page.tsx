import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | TrollFit",
  description:
    "Read TrollFit's Terms of Service — how we operate, order & payment policies, shipping, returns, and your rights as a customer.",
};

const LAST_UPDATED = "June 26, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      {/* Hero */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Legal
          </span>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Terms of{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Intro Card */}
        <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Welcome to <span className="font-bold text-foreground">TrollFit</span> — Pakistan's dopest Gen-Z streetwear brand. By accessing our website at{" "}
            <span className="font-semibold text-primary">trollfit.pk</span> or placing an order with us, you agree to be bound by these Terms of Service. Please read them carefully. If you don't agree with any part, we totally respect that — but you won't be able to use our services.
          </p>
        </div>

        <div className="space-y-10">
          {/* Section 1 */}
          <Section number="01" title="Use of Service">
            <p>
              TrollFit operates as an online retail store selling premium streetwear, meme-inspired graphic tees, anime drops, and oversized essentials across Pakistan. By using our website and services, you confirm that:
            </p>
            <ul>
              <li>You are at least 13 years of age. If you are under 18, you have the consent of a parent or guardian.</li>
              <li>All information you provide (name, address, phone number) is accurate and current.</li>
              <li>You will not use our platform for any unlawful purpose, including fraud, impersonation, or harassment.</li>
              <li>You will not attempt to reverse-engineer, scrape, or exploit our website's code, pricing data, or product designs.</li>
              <li>You acknowledge that product images are representative — slight variations in colour may exist due to screen calibration and print batches.</li>
            </ul>
            <p>
              We reserve the right to refuse service, cancel orders, or terminate accounts at our sole discretion if we believe these terms have been violated.
            </p>
          </Section>

          {/* Section 2 */}
          <Section number="02" title="Orders & Payment">
            <p>
              All prices on TrollFit are listed in <strong>Pakistani Rupees (PKR)</strong> and are inclusive of applicable taxes unless otherwise stated.
            </p>
            <Subheading>Cash on Delivery (COD)</Subheading>
            <p>
              TrollFit currently operates exclusively on a <strong>Cash on Delivery</strong> model. This means:
            </p>
            <ul>
              <li>No advance payment is required at the time of order placement.</li>
              <li>Payment is collected by the courier at the time of delivery in cash.</li>
              <li>We do not accept cheques, bank drafts, or third-party payment at the door.</li>
            </ul>
            <Subheading>Order Confirmation</Subheading>
            <p>
              Once you place an order, you will receive an SMS confirmation on your registered mobile number. Our team will call to verify all COD orders before dispatch — this is to protect you from fraudulent orders placed in your name.
            </p>
            <Subheading>Pricing & Availability</Subheading>
            <p>
              We reserve the right to modify prices without prior notice. In the event of a pricing error, we will contact you before fulfilling the order. Product availability is not guaranteed until your order is confirmed by our team. Limited edition drops may sell out at any time.
            </p>
            <Subheading>Coupon Codes & Discounts</Subheading>
            <p>
              Promotional coupon codes are issued at TrollFit's discretion. Only one coupon code may be applied per order. Coupons cannot be combined with other active promotions, exchanged for cash, or applied retroactively to completed orders. TrollFit reserves the right to expire or invalidate any coupon code at any time.
            </p>
          </Section>

          {/* Section 3 */}
          <Section number="03" title="Shipping & Delivery">
            <p>
              We ship across Pakistan — from Karachi to Khyber, from Lahore to Gwadar. No location too far for the drip.
            </p>
            <Subheading>Shipping Rates</Subheading>
            <ul>
              <li>Orders above <strong>Rs. 3,000</strong> qualify for free shipping nationwide.</li>
              <li>Orders below Rs. 3,000 carry a flat shipping fee of <strong>Rs. 200</strong>.</li>
            </ul>
            <Subheading>Delivery Timeframes</Subheading>
            <ul>
              <li><strong>Major cities</strong> (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad): 2–4 business days.</li>
              <li><strong>Secondary cities</strong> (Multan, Peshawar, Quetta, Sialkot, Hyderabad): 3–6 business days.</li>
              <li><strong>Remote areas</strong>: 5–9 business days. We'll keep you posted via SMS.</li>
            </ul>
            <Subheading>Delays & Force Majeure</Subheading>
            <p>
              Delivery timeframes are estimates, not guarantees. Delays caused by courier disruptions, public holidays, natural disasters, or other circumstances beyond our control do not constitute a breach of these terms. TrollFit will not be held liable for shipping delays.
            </p>
            <Subheading>Failed Delivery Attempts</Subheading>
            <p>
              If the courier is unable to reach you after two attempts, the parcel may be returned to us. In such cases, re-delivery charges apply and are the customer's responsibility.
            </p>
          </Section>

          {/* Section 4 */}
          <Section number="04" title="Returns & Exchanges">
            <p>
              We want you to be happy with your TrollFit order. If something's off — we've got you.
            </p>
            <Subheading>Eligible Returns</Subheading>
            <p>
              You may request a return or exchange within <strong>7 days</strong> of receiving your order under the following conditions:
            </p>
            <ul>
              <li>Item received is materially different from what was ordered (wrong product, wrong size).</li>
              <li>Item has a manufacturing defect (torn seams, print misalignment exceeding 2cm, fabric flaw).</li>
              <li>Item is unworn, unwashed, and in its original packaging with tags intact.</li>
            </ul>
            <Subheading>Non-Returnable Items</Subheading>
            <ul>
              <li>Items marked as <strong>Final Sale</strong> or <strong>Limited Edition</strong> at the time of purchase.</li>
              <li>Items returned after the 7-day window.</li>
              <li>Items showing signs of wear, washing, or alteration.</li>
              <li>Custom or personalised orders.</li>
            </ul>
            <Subheading>How to Return</Subheading>
            <p>
              DM us on Instagram <span className="font-semibold text-primary">@trollfit.pk</span> or WhatsApp us at the number in your order confirmation. We'll provide a return courier slip. All approved refunds are processed as store credit within <strong>3–5 business days</strong>. We do not issue cash refunds.
            </p>
          </Section>

          {/* Section 5 */}
          <Section number="05" title="Intellectual Property & Meme Prints">
            <p>
              All TrollFit original designs, graphics, branding, logos, the monogram mark, and website content are the intellectual property of TrollFit and are protected under applicable Pakistani and international copyright law.
            </p>
            <Subheading>Original Artwork</Subheading>
            <p>
              Our original graphics — including TrollFit-created meme-inspired prints, typography treatments, and design compositions — are exclusively ours. You may not reproduce, distribute, sell, or create derivative works from our designs without explicit written permission.
            </p>
            <Subheading>Fan Art & Pop Culture References</Subheading>
            <p>
              Some TrollFit products feature designs inspired by internet culture, memes, and anime. These products are created as transformative fan art and cultural commentary. TrollFit does not claim ownership of underlying characters, franchises, or memes that belong to their respective creators. All third-party trademarks belong to their respective owners.
            </p>
            <Subheading>User Content</Subheading>
            <p>
              By sharing photos of TrollFit products on social media and tagging us, you grant TrollFit a non-exclusive, royalty-free license to repost, share, and use your content for marketing purposes. We'll always give you credit.
            </p>
          </Section>

          {/* Section 6 */}
          <Section number="06" title="Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, TrollFit and its owners, employees, affiliates, and partners shall not be liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages arising from your use of our products or services.</li>
              <li>Loss of data, profit, or goodwill.</li>
              <li>Any damage arising from courier mishandling post-dispatch.</li>
              <li>Allergic or adverse reactions to fabric or print materials — please review product material details before purchasing if you have sensitivities.</li>
              <li>Errors in product descriptions that are corrected after your order was placed (we will notify you).</li>
            </ul>
            <p>
              Our maximum liability to you for any claim related to a purchase shall not exceed the total amount you paid for that specific order.
            </p>
            <p>
              TrollFit makes no warranty that the website will be uninterrupted, error-free, or free from viruses or other harmful components. Use our site at your own risk.
            </p>
          </Section>

          {/* Section 7 */}
          <Section number="07" title="Privacy">
            <p>
              Your privacy matters to us. We collect only the information necessary to process and deliver your orders — your name, phone number, and address. We do not sell or share your personal data with third parties beyond our courier partners.
            </p>
            <p>
              By placing an order, you consent to receive order-related SMS notifications. We may occasionally send promotional messages — you can opt out at any time by replying STOP or DMing us.
            </p>
          </Section>

          {/* Section 8 */}
          <Section number="08" title="Governing Law">
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.
            </p>
            <p>
              If any provision of these terms is found to be unenforceable, the remaining provisions will continue to apply in full force.
            </p>
          </Section>

          {/* Section 9 */}
          <Section number="09" title="Changes to Terms">
            <p>
              TrollFit reserves the right to update these Terms of Service at any time. When we make material changes, we'll update the "Last Updated" date at the top of this page. Continued use of our services after changes constitutes acceptance of the updated terms.
            </p>
            <p>
              We recommend checking this page periodically. We'll also post major changes on our Instagram — so follow us anyway 😎
            </p>
          </Section>

          {/* Contact */}
          <Section number="10" title="Contact Us">
            <p>
              Got questions about these terms? Something unclear? Hit us up — we're real people and we actually respond.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ContactCard label="Instagram" value="@trollfit.pk" href="https://instagram.com/trollfit.pk" />
              <ContactCard label="WhatsApp" value="+92 300 TROLLFIT" href="https://wa.me/923001234567" />
              <ContactCard label="Email" value="hello@trollfit.pk" href="mailto:hello@trollfit.pk" />
              <ContactCard label="Based in" value="Karachi, Pakistan 🇵🇰" />
            </div>
          </Section>
        </div>

        {/* Footer note */}
        <div className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            By shopping at TrollFit, you've already agreed to all of this. No cap.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-28">
      <div className="mb-5 flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
          {number}
        </span>
        <h2 className="text-xl font-black uppercase tracking-wide">{title}</h2>
      </div>
      <div className="ml-[3.25rem] space-y-4 text-[15px] leading-7 text-muted-foreground [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_li]:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <p className="!mt-5 text-sm font-bold uppercase tracking-widest text-foreground/80">
      {children}
    </p>
  );
}

function ContactCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return inner;
}
