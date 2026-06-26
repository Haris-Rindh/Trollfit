import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
}

const CATEGORIES = [
  { id: "cat-1", name: "Meme Tees" },
  { id: "cat-2", name: "Anime Core" },
  { id: "cat-3", name: "Retro Wave" },
];

const SIZES = ["S", "M", "L", "XL", "2XL"];

export function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Category
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                selectedCategory === null
                  ? "bg-primary/10 font-bold text-primary"
                  : "hover:bg-muted"
              )}
            >
              All Drops
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  selectedCategory === cat.id
                    ? "bg-primary/10 font-bold text-primary"
                    : "hover:bg-muted"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clear Filters */}
      {(selectedCategory || selectedSize) && (
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSize(null);
          }}
          className="w-full text-sm font-medium text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
