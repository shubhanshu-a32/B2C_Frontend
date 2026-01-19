import { create } from "zustand";
import toast from "react-hot-toast";

const STORAGE_KEY = "b2c_auth_v1";

const getInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {

  }
  return { user: null, accessToken: null, refreshToken: null };
};

const useAuthStore = create((set) => ({
  ...getInitialState(),

  initAuth: () => {
    // No-op now as state is generic
  },

  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken, refreshToken })
    );
  },

  login: (user, accessToken, refreshToken = null) => {
    set({ user, accessToken, refreshToken });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken, refreshToken })
    );
  },

  setUser: (user) => {
    set((state) => {
      const newState = {
        user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  setToken: (token) => {
    set((state) => {
      const newState = {
        user: state.user,
        accessToken: token,
        refreshToken: state.refreshToken
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
    toast.success("Logged out");
  }
}));

export default useAuthStore;