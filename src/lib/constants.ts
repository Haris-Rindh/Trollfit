// ─── Site Constants ──────────────────────────────────────

export const SITE_CONFIG = {
  name: "TrollFit",
  tagline: "Wear The Internet™",
  description:
    "Pakistan's most viral streetwear brand. Meme tees, anime shirts, oversized fashion & custom designs. Premium quality, nationwide delivery.",
  url: "https://trollfit.pk",
  ogImage: "/og-image.jpg",
  creator: "TrollFit",
  keywords: [
    "meme t-shirts Pakistan",
    "anime shirts Pakistan",
    "oversized tees Pakistan",
    "custom shirts Pakistan",
    "streetwear Pakistan",
    "Gen-Z fashion Pakistan",
    "viral t-shirts",
    "internet culture clothing",
    "TrollFit",
    "trendy shirts Pakistan",
  ],
} as const;

// ─── Navigation ──────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Trending 🔥", href: "/shop?sort=trending" },
  { label: "New Drops", href: "/shop?filter=new" },
  { label: "Custom Design", href: "/custom" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Meme Collection", href: "/collections/meme" },
    { label: "Anime Collection", href: "/collections/anime" },
    { label: "Oversized Tees", href: "/collections/oversized" },
    { label: "Trending Drops", href: "/collections/trending" },
    { label: "Limited Edition", href: "/collections/limited" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Exchange", href: "/returns" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
} as const;

// ─── Product Sizes ───────────────────────────────────────

export const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"] as const;

export const SIZE_CHART = {
  XS: { chest: '34"', length: '26"', shoulder: '16"' },
  S: { chest: '36"', length: '27"', shoulder: '17"' },
  M: { chest: '38"', length: '28"', shoulder: '18"' },
  L: { chest: '40"', length: '29"', shoulder: '19"' },
  XL: { chest: '42"', length: '30"', shoulder: '20"' },
  "2XL": { chest: '44"', length: '31"', shoulder: '21"' },
  "3XL": { chest: '46"', length: '32"', shoulder: '22"' },
} as const;

// ─── Pakistan Cities ─────────────────────────────────────

export const PK_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Sukkur",
  "Larkana",
  "Sahiwal",
  "Sheikhupura",
  "Mirpur Khas",
  "Rahim Yar Khan",
  "Gujrat",
  "Jhang",
  "Jhelum",
  "Kasur",
  "Chiniot",
  "Okara",
  "Dera Ghazi Khan",
  "Nawabshah",
  "Mingora",
  "Kamoke",
  "Mandi Bahauddin",
  "Muzaffarabad",
  "Other",
] as const;

// ─── Shipping ────────────────────────────────────────────

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 3000, // PKR
  standardShipping: 200, // PKR
  expressShipping: 400, // PKR
  estimatedDays: {
    standard: "3-5 business days",
    express: "1-2 business days",
  },
  currency: "PKR",
  currencySymbol: "Rs.",
} as const;

// ─── Social Links ────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/trollfit.pk",
  tiktok: "https://tiktok.com/@trollfit.pk",
  facebook: "https://facebook.com/trollfit.pk",
  twitter: "https://twitter.com/trollfit_pk",
  whatsapp: "https://wa.me/923001234567",
} as const;

// ─── Animation Constants ─────────────────────────────────

export const ANIMATION = {
  ease: {
    smooth: [0.16, 1, 0.3, 1] as const,
    bounce: [0.34, 1.56, 0.64, 1] as const,
    elastic: [0.68, -0.55, 0.265, 1.55] as const,
  },
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
} as const;

// ─── Trust Badges ────────────────────────────────────────

export const TRUST_BADGES = [
  {
    icon: "shield-check",
    title: "Premium Quality",
    desc: "100% premium cotton",
  },
  {
    icon: "truck",
    title: "Nationwide Delivery",
    desc: "All across Pakistan",
  },
  {
    icon: "banknote",
    title: "Cash on Delivery",
    desc: "Pay when you receive",
  },
  {
    icon: "rotate-ccw",
    title: "Easy Returns",
    desc: "7-day return policy",
  },
  {
    icon: "printer",
    title: "HD Printing",
    desc: "Vibrant, lasting prints",
  },
  {
    icon: "headphones",
    title: "24/7 Support",
    desc: "WhatsApp support",
  },
] as const;
