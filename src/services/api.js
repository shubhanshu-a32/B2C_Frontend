import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh logic
api.interceptors.response.use(
  async (res) => {
    return res;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post("http://localhost:4000/api/auth/refresh", {
          refreshToken,
        });

        const newAccess = res.data.accessToken;
        useAuthStore.setState({ accessToken: newAccess });

        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;