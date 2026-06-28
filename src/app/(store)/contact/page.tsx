"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, Clock, Send, Sparkles, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! We will WhatsApp/email you back soon. 🔥");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("General Inquiry");
      setMessage("");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Get In Touch</span>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            CONTACT US
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Have a size issue? Want a custom design? Or just want to talk about memes? Drop us a line and we'll hit you back.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 lg:items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="block group rounded-2xl border border-border bg-card/30 p-6 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-emerald-400 transition-colors">WhatsApp Chat</h3>
                  <p className="mt-1 text-sm font-semibold text-foreground">+92 300 1234567</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">Fastest support. Tap to open WhatsApp chat instantly.</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@trollfit.pk"
              className="block group rounded-2xl border border-border bg-card/30 p-6 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">Email Support</h3>
                  <p className="mt-1 text-sm font-semibold text-foreground">hello@trollfit.pk</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">For custom wholesale orders, collaborations, or general help.</p>
                </div>
              </div>
            </a>

            {/* Timings */}
            <div className="rounded-2xl border border-border bg-card/30 p-6">
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Support Hours</h3>
                  <p className="mt-1 text-sm font-semibold text-foreground">Mon - Sat: 10AM - 8PM</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">We usually reply within an hour during support timings.</p>
                </div>
              </div>
            </div>

            {/* Announcement Box */}
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex gap-3 text-yellow-500/80 leading-relaxed text-xs">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <strong>Custom Orders:</strong> If you are requesting a custom design, please use our <a href="/custom" className="font-bold underline">AI Custom Design Tool</a> first to generate mockups!
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card/45 p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-wide border-b border-border pb-4">
                Send A Message
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ali Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="ali@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Query">Order Status / Delivery Query</option>
                    <option value="Size Exchange">Size / Product Exchange</option>
                    <option value="Custom Drip">Custom Print Design Request</option>
                    <option value="Feedback">Feedback / Suggestions</option>
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your issue or custom design request here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none transition-colors focus:border-primary resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    SUBMIT INQUIRY <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </main>
  );
}
