import { create } from "zustand";

interface UIState {
  // Mobile nav
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Cart sheet
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Scroll
  isScrolled: boolean;
  setIsScrolled: (value: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  // Mobile nav
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () =>
    set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  // Search
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  // Cart sheet
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // Scroll
  isScrolled: false,
  setIsScrolled: (value) => set({ isScrolled: value }),
}));
