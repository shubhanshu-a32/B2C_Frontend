import api from "./api";

const variantService = {
    createVariant: async (data) => {
        return await api.post("/variants", data);
    },

    getVariantsByProduct: async (productId) => {
        return await api.get(`/variants/product/${productId}`);
    },

    updateVariant: async (id, data) => {
        return await api.put(`/variants/${id}`, data);
    },

    deleteVariant: async (id) => {
        return await api.delete(`/variants/${id}`);
    }
};

export default variantService;
