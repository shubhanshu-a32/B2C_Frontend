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

      addToCart: (product, qty = 1, variant = null) => {
        let items = get().items.slice();

        const targetVid = variant ? String(variant._id) : null;
        const targetPid = String(product._id);

        const idx = items.findIndex((i) =>
          String(i.productId) === targetPid &&
          (targetVid ? String(i.variantId) === targetVid : !i.variantId)
        );

        if (idx > -1) {
          items[idx].qty += qty;
        } else {
          const finalPrice = variant ? variant.price : product.price;
          const finalImage = variant?.images?.[0] || product.images?.[0] || null;

          items.push({
            productId: targetPid,
            title: product.title,
            price: finalPrice,
            qty,
            image: finalImage,
            sellerId: typeof product.sellerId === 'object' ? product.sellerId._id : product.sellerId,
            sellerName: typeof product.sellerId === 'object' ? product.sellerId.shopName : (product.sellerName || "Unknown Seller"),
            variantId: targetVid, // Store as String
            attributes: variant ? variant.attributes : null,
          });
        }

        // Auto-Deduplicate just in case state got messy
        set({ items });
      },

      removeFromCart: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter((i) => {
            const samePid = String(i.productId) === String(productId);
            const sameVid = variantId ? String(i.variantId) === String(variantId) : !i.variantId;
            return !(samePid && sameVid);
          }),
        }));
        toast.error("Removed from cart");
      },

      updateQty: (productId, qty, variantId = null) => {
        set((state) => ({
          items: state.items.map((i) => {
            const samePid = String(i.productId) === String(productId);
            const sameVid = variantId ? String(i.variantId) === String(variantId) : !i.variantId;
            return (samePid && sameVid) ? { ...i, qty } : i;
          }),
        }));
      },

      deduplicateCart: () => {
        set((state) => {
          const uniqueItems = [];
          state.items.forEach(item => {
            const existingIdx = uniqueItems.findIndex(u =>
              String(u.productId) === String(item.productId) &&
              (u.variantId ? String(u.variantId) === String(item.variantId) : !item.variantId)
            );
            if (existingIdx > -1) {
              uniqueItems[existingIdx].qty += item.qty;
            } else {
              uniqueItems.push(item);
            }
          });
          return { items: uniqueItems };
        });
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
