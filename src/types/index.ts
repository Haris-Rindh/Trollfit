// ─── Product Types ───────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  images: string[];
  video?: string;
  sizes: string[];
  colors: string[];
  stockBySize: Record<string, number>;
  totalStock: number;
  categoryId?: string;
  category?: Category;
  collectionId?: string;
  collection?: Collection;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  type: CollectionType;
  featured: boolean;
  productCount?: number;
}

export type CollectionType =
  | "MEME"
  | "ANIME"
  | "OVERSIZED"
  | "TRENDING"
  | "LIMITED"
  | "STREETWEAR"
  | "CUSTOM";

// ─── Cart Types ──────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color?: string;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  totalItems: () => number;
  subtotal: () => number;
  total: () => number;
}

// ─── Order Types ─────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethod = "COD" | "JAZZCASH" | "EASYPAISA";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Order {
  id: string;
  number: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string;
  trackingNumber?: string;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  color?: string;
  price: number;
  name: string;
  image?: string;
}

// ─── Review Types ────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  userImage?: string;
  productId: string;
  rating: number;
  comment?: string;
  images: string[];
  verified: boolean;
  createdAt: Date;
}

// ─── Coupon Types ────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: Date;
}

// ─── Address Types ───────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province?: string;
  postalCode?: string;
  isDefault: boolean;
}

// ─── User Types ──────────────────────────────────────────

export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  role: "CUSTOMER" | "ADMIN";
}

// ─── Banner Types ────────────────────────────────────────

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  active: boolean;
  position: number;
}

// ─── Checkout Types ──────────────────────────────────────

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

// ─── Filter Types ────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: "newest" | "price-asc" | "price-desc" | "trending" | "popular";
  search?: string;
  page?: number;
  limit?: number;
}

// ─── API Response Types ──────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
