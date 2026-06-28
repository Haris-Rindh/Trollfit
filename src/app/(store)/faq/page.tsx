"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: "shipping" | "orders" | "products" | "custom";
}

const FAQS: FAQItem[] = [
  {
    category: "shipping",
    q: "How long does delivery take?",
    a: "Standard shipping takes 3-5 business days across Pakistan. Express delivery (1-2 days) is available for Karachi, Lahore, and Islamabad/Rawalpindi.",
  },
  {
    category: "orders",
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes! Cash on Delivery (COD) is available nationwide. You only pay when the rider delivers your parcel. No advance payment is needed.",
  },
  {
    category: "orders",
    q: "What is your return/exchange policy?",
    a: "We offer a 7-day hassle-free return or exchange policy for sizing issues or defects. Items must be unworn with tags attached. WhatsApp us to initiate a return.",
  },
  {
    category: "orders",
    q: "How do I track my order?",
    a: "Once shipped, you'll receive a WhatsApp text with a tracking number. You can enter it on our 'Track Order' page to view live updates.",
  },
  {
    category: "products",
    q: "Are the prints washable?",
    a: "Yes, our DTF prints are built to last. For best results, wash your tees inside-out in cold water, and avoid ironing directly over the prints.",
  },
  {
    category: "shipping",
    q: "Do you ship internationally?",
    a: "Currently, we only deliver within Pakistan. International shipping options will be available soon!",
  },
  {
    category: "custom",
    q: "Can I print a custom design?",
    a: "Absolutely! Go to our AI Custom Design page, write your idea, generate mockups, and place your order instantly.",
  },
  {
    category: "products",
    q: "What sizes do you offer?",
    a: "We offer S, M, L, XL, 2XL, and 3XL sizes. For exact measurements, check out our interactive Size Guide page.",
  },
  {
    category: "orders",
    q: "How do I contact support?",
    a: "WhatsApp is the fastest way: +92 300 1234567. Email Hello@trollfit.pk is also available. Timings are Mon-Sat, 10AM-8PM.",
  },
];


export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "shipping" | "orders" | "products" | "custom">("all");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || faq.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-background text-foreground py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Need Help?</span>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            FAQ<span className="text-primary">s</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Frequently asked questions about ordering, shipping, sizing, and print quality.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-10 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQs (e.g. delivery, sizes, custom)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card/50 py-4 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: "all", label: "All Questions" },
              { id: "shipping", label: "Shipping" },
              { id: "orders", label: "Orders & COD" },
              { id: "products", label: "Products & Sizing" },
              { id: "custom", label: "Custom Prints" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id as any);
                  setOpenIndex(null);
                }}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        {filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <HelpCircle className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No matches found for your search. Try another query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-border bg-card/30 transition-colors hover:bg-card/65"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background transition-colors">
                      {isOpen ? <Minus className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-border px-6 py-5 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
