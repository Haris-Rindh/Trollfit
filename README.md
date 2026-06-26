# TrollFit — Pakistan's Most Viral Streetwear Brand

> **Wear The Internet™** — Premium meme tees, anime shirts, oversized fashion & custom designs.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **State Management**: Zustand
- **Database**: PostgreSQL + Prisma ORM
- **CMS**: Sanity CMS
- **Auth**: Auth.js v5
- **Storage**: Cloudinary
- **Payments**: COD + JazzCash + Easypaisa
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd trollfit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma migrate dev --name init
npx prisma generate

# Start development server
npm run dev
```

### Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (store)/            # Public store routes
│   ├── (auth)/             # Authentication routes
│   ├── admin/              # Admin dashboard
│   ├── studio/             # Sanity Studio
│   └── api/                # API routes
├── components/
│   ├── ui/                 # ShadCN UI primitives
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Homepage sections
│   ├── product/            # Product components
│   ├── shop/               # Shop page components
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout components
│   ├── admin/              # Admin components
│   ├── shared/             # Reusable components
│   └── animations/         # Animation wrappers
├── lib/                    # Utilities & configs
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── hooks/                  # Custom hooks
```

## 🎨 Design System

- **Primary**: Electric Purple (#a855f7)
- **Accent**: Neon Cyan (#06b6d4)
- **Background**: Matte Black (#0a0a0a)
- **Theme**: Dark mode primary

## 📊 Features

- ✅ Cinematic homepage with 10 premium sections
- ✅ Product catalog with advanced filtering
- ✅ Cart system with coupon support
- ✅ Mobile-first checkout (COD optimized)
- ✅ Admin dashboard
- ✅ AI design generator section
- ✅ Full SEO optimization
- ✅ Analytics integration (GA4, Meta, TikTok)
- ✅ Responsive design
- ✅ Premium animations

## 🇵🇰 Made with ❤️ in Pakistan
