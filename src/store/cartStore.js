import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";

const useCartStore = create((set, get) => ({
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
      });
    }
    set({ items });
    toast.success("Added to cart");
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

  // Place order: posts to backend /orders (expects backend createOrder shape)
  placeOrder: async (paymentType = "COD") => {
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
      };
      const res = await api.post("/orders", payload);
      set({ loading: false, items: [] });
      toast.success("Order placed successfully!");
      return res.data;
    } catch (err) {
      set({ loading: false });
      toast.error("Failed to place order");
      throw err;
    }
  },
}));

export default useCartStore;
