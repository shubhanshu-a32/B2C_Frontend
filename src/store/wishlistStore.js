import { create } from "zustand";
import toast from "react-hot-toast";

const KEY = "b2c_wishlist";

const useWishListStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem(KEY)) || [],

  toggle: (product) => {
    const items = get().items;
    const exists = items.find((p) => p._id === product._id);

    let updated;
    if (exists) {
      updated = items.filter((p) => p._id !== product._id);
      toast.success("Removed from wishlist");
    } else {
      updated = [...items, product];
      toast.success("Added to wishlist");
    }

    localStorage.setItem(KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  remove: (id) => {
    const updated = get().items.filter((p) => p._id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  clear: () => {
    localStorage.removeItem(KEY);
    set({ items: [] });
  },
}));

export default useWishListStore;
