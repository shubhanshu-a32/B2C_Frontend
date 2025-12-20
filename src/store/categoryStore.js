import { create } from "zustand";
import api from "../services/api";

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  selected: null,

  fetchCategories: async () => {
    if (get().categories.length) return;
    set({ loading: true });
    try {
      const res = await api.get("/categories");
      const desired = ["Fashion", "Grocery", "Furniture"];
      const cats = res.data.filter((c) => desired.includes(c.name));
      set({ categories: cats, loading: false });
    } catch (err) {
      console.error("fetchCategories:", err);
      set({ loading: false });
    }
  },

  setSelected: (cat) => set({ selected: cat }),
  clearSelected: () => set({ selected: null })
}));

export default useCategoryStore;