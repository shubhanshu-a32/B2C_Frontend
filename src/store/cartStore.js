import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, title, price, qty, image }
      loading: false,

      addToCart: (product, qty = 1) => {
        const items = get().items.slice();
        const idx = items.findIndex((i) => i.productId === product._id);
        if (idx > -1) {
          items[idx].qty += qty;
        } else {
          items.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            qty,
            image: product.images?.[0] || null,
            sellerId: typeof product.sellerId === 'object' ? product.sellerId._id : product.sellerId,
            sellerName: typeof product.sellerId === 'object' ? product.sellerId.shopName : (product.sellerName || "Unknown Seller"),
          });
        }
        set({ items });
        // toast.success("Added to cart");
      },

      removeFromCart: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
        toast.error("Removed from cart");
      },

      updateQty: (productId, qty) => {
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Place order: posts to backend /orders
      placeOrder: async (paymentType = "COD", address = null, couponData = { code: null, discount: 0 }) => {
        const authUser = useAuthStore.getState().user;
        if (!authUser || authUser.role !== "buyer") {
          toast.error("Please login as buyer to place an order");
          throw new Error("NOT_AUTHENTICATED");
        }
        const { items } = get();
        if (!items.length) {
          toast.error("Cart empty");
          return null;
        }
        set({ loading: true });
        try {
          // transform items to productId + quantity + price
          const payload = {
            items: items.map((i) => ({ productId: i.productId, quantity: i.qty, price: i.price })),
            paymentType,
            address,
            couponCode: couponData.code,
            discount: couponData.discount
          };
          const res = await api.post("/orders", payload);
          set({ loading: false, items: [] });
          toast.success("Order placed successfully!");
          return res.data;
        } catch (err) {
          set({ loading: false });

          // Handle Specific Validation Errors (Stale Cart)
          if (err.response && err.response.data && err.response.data.invalidProductId) {
            const { invalidProductId, errorType, message } = err.response.data;
            toast.error(message);

            // Auto-remove invalid item
            get().removeFromCart(invalidProductId);
            return null;
          }

          const msg = err.response?.data?.message || "Failed to place order";
          toast.error(msg);
          throw err;
        }
      },
    }),
    {
      name: "ketalog-cart", // unique name in localStorage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ items: state.items }), // Only persist items, not loading state
    }
  )
);

export default useCartStore;
