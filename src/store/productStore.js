import { create } from "zustand";
import api from "../services/api";

const useProductStore = create((set) => ({
  products: [],
  product: null,
  page: 1,
  pages: 1,
  total: 0,
  loading: false,

  fetchProducts: async (options = {}) => {
    const page = options.page || 1;
    const limit = options.limit || 12;
    const params = { page, limit };
    if (options.category) params.category = options.category;
    if (options.q) params.q = options.q;

    set({ loading: true });
    try {
      const res = await api.get("/products", { params });
      // expecting { data, total, page, pages }
      set({
        products: res.data.data || res.data, // backend returns { data: [...] }
        page: res.data.page ?? page,
        pages: res.data.pages ?? 1,
        total: res.data.total ?? (res.data.data ? res.data.data.length : 0),
        loading: false
      });
    } catch (err) {
      // console.error("fetchProducts:", err);
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, product: null });
    try {
      const res = await api.get(`/products/${id}`);
      set({ product: res.data, loading: false });
    } catch (err) {
      // console.error("fetchProductById:", err);
      set({ loading: false });
    }
  },

  createProduct: async (payload) => {
    set({ loading: true });
    try {
      const res = await api.post("/products", payload);
      set((state) => ({ loading: false }));
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateProduct: async (id, payload) => {
    set({ loading: true });
    try {
      const res = await api.put(`/products/${id}`, payload);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await api.delete(`/products/${id}`);
      set({ loading: false });
      return res;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  clearProducts: () => set({ products: [], product: null, page: 1, pages: 1, total: 0 })
}));

export default useProductStore;