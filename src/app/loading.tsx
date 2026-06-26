export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-primary">TF</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading the drip...</p>
      </div>
    </div>
  );
}
