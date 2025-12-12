import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, UserProfile } from '../types';

interface AppState {
  user: UserProfile | null;
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  searchQuery: string;
  
  setUser: (user: UserProfile | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      wishlist: [],
      searchQuery: '',

      setUser: (user) => set({ user }),

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId),
      })),

      updateQuantity: (productId, delta) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === productId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        }),
      })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => set((state) => {
        const inWishlist = state.wishlist.includes(productId);
        return {
          wishlist: inWishlist
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        };
      }),

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'gibson-collections-storage',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }), // Only persist cart and wishlist locally
    }
  )
);
