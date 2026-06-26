import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TrollFit — Wear The Internet™ | Pakistan's #1 Streetwear Brand",
    template: "%s | TrollFit",
  },
  description:
    "Pakistan's most viral streetwear brand. Premium meme tees, anime shirts, oversized fashion & custom designs. Cash on delivery nationwide. Shop now!",
  keywords: [
    "meme t-shirts Pakistan",
    "anime shirts Pakistan",
    "oversized tees Pakistan",
    "custom shirts Pakistan",
    "streetwear Pakistan",
    "Gen-Z fashion Pakistan",
    "viral t-shirts",
    "TrollFit",
  ],
  authors: [{ name: "TrollFit" }],
  creator: "TrollFit",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TrollFit",
    title: "TrollFit — Wear The Internet™",
    description:
      "Pakistan's most viral streetwear brand. Premium meme tees, anime shirts, oversized fashion & custom designs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TrollFit — Wear The Internet™",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrollFit — Wear The Internet™",
    description: "Pakistan's most viral streetwear brand.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          {/* Global Subtle Backgrounds */}
          <div className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.08] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }} />
          <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.15),rgba(255,255,255,0))]" />
          
          {children}
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: "600",
              },
              success: {
                iconTheme: { primary: "#a855f7", secondary: "#fff" },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
