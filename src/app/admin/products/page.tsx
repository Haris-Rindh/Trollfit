"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Package,
  Loader2,
  X,
  Edit2,
  AlertTriangle,
  Grid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stockBySize: Record<string, number>;
  totalStock: number;
  tags: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Edit fields
  const [editPrice, setEditPrice] = useState("");
  const [editSalePrice, setEditSalePrice] = useState("");
  const [editStock, setEditStock] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data.products);
    } catch (err: any) {
      console.warn("Fetch products API failed, loading static catalog:", err);
      const formattedDemo: Product[] = DEMO_PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice !== undefined ? p.salePrice : null,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        stockBySize: p.stockBySize,
        totalStock: p.totalStock,
        tags: p.tags || [],
      }));
      setProducts(formattedDemo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditPrice(product.price.toString());
    setEditSalePrice(product.salePrice ? product.salePrice.toString() : "");
    
    // Copy stock details per size
    const stockCopy: Record<string, number> = {};
    product.sizes.forEach((size) => {
      stockCopy[size] = product.stockBySize[size] !== undefined ? product.stockBySize[size] : 0;
    });
    setEditStock(stockCopy);
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    try {
      setSaving(true);
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProduct.id,
          price: editPrice,
          salePrice: editSalePrice || null,
          stockBySize: editStock,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product details");

      toast.success("Product updated successfully!");
      setProducts(products.map((p) => (p.id === selectedProduct.id ? data.product : p)));
      setSelectedProduct(null);
    } catch (err: any) {
      console.warn("Save product API failed, saving changes in offline React state:", err);
      const updatedProduct: Product = {
        ...selectedProduct,
        price: Number(editPrice),
        salePrice: editSalePrice ? Number(editSalePrice) : null,
        stockBySize: editStock,
        totalStock: Object.values(editStock).reduce((sum, val) => sum + (Number(val) || 0), 0),
      };

      toast.success("Updated product locally (offline mode) 🌐");
      setProducts(products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)));
      setSelectedProduct(null);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Products Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Manage prices, active discounts, and sizes stock levels for your clothing lines.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search catalog by product name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/5 bg-[#0e0e11] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Grid of Catalog items */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-20 text-center text-muted-foreground">
          No products match your search.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const lowStockSizes = Object.entries(product.stockBySize).filter(
              ([size, qty]) => qty === 0
            );

            return (
              <motion.div
                key={product.id}
                layoutId={`card-${product.id}`}
                className="rounded-2xl border border-white/5 bg-[#0e0e11] p-5 space-y-4 hover:border-white/10 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Image & details */}
                  <div className="flex gap-4">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-xl object-cover bg-card border border-white/5 shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <Grid className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate text-sm leading-snug">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                        {product.slug}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-bold text-white text-xs">
                          Rs. {Number(product.price).toLocaleString()}
                        </span>
                        {product.salePrice && (
                          <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                            On Sale (Rs. {Number(product.salePrice).toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock size breakdown */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Sizes Stock
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((size) => {
                        const qty = product.stockBySize[size] || 0;
                        return (
                          <span
                            key={size}
                            className={`rounded-lg border px-2 py-1 text-[10px] font-bold ${
                              qty === 0
                                ? "border-red-500/20 text-red-400 bg-red-500/5"
                                : qty < 5
                                ? "border-amber-500/20 text-amber-400 bg-amber-500/5"
                                : "border-white/5 text-muted-foreground bg-[#09090b]"
                            }`}
                          >
                            {size}: <span className="text-white font-black">{qty}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                  {/* Warnings if any size is sold out */}
                  {lowStockSizes.length > 0 ? (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold uppercase tracking-wide">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {lowStockSizes.length} {lowStockSizes.length === 1 ? "size" : "sizes"} sold out
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                      All sizes stocked
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e11] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Edit Catalog: {selectedProduct.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{selectedProduct.slug}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                {/* Pricing Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Base Retail Price (PKR)
                    </label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-card px-3 py-2.5 outline-none focus:border-primary text-white font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Discount Sale Price (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="Leave blank for regular price"
                      value={editSalePrice}
                      onChange={(e) => setEditSalePrice(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-card px-3 py-2.5 outline-none focus:border-primary text-white font-bold"
                    />
                  </div>
                </div>

                {/* Stock per sizes Editor */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Size-Specific Stock Control
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {selectedProduct.sizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center gap-2 border border-white/5 rounded-lg p-2.5 bg-[#09090b] justify-between"
                      >
                        <span className="font-bold text-white text-xs">{size}</span>
                        <input
                          type="number"
                          value={editStock[size] !== undefined ? editStock[size] : ""}
                          onChange={(e) =>
                            setEditStock({
                              ...editStock,
                              [size]: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-16 rounded-md border border-white/10 bg-card py-1 px-2 text-center text-xs outline-none focus:border-primary text-white font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/95 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
