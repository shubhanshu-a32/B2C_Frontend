import { create } from "zustand";
import toast from "react-hot-toast";

const STORAGE_KEY = "b2c_auth_v1";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  // Restore session (called inside main.jsx)
  initAuth: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const { user, accessToken, refreshToken } = JSON.parse(raw);
      set({ user, accessToken, refreshToken });
    } catch (err) {
      console.error("Auth restore failed:", err);
    }
  },

  // Full auth setter used by OTPVerify.jsx
  setAuth: (user, accessToken, refreshToken) => {
    set({ user, accessToken, refreshToken });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken, refreshToken })
    );
  },

  // Legacy login(user, token) support (buyer/seller dashboards)
  login: (user, token) => {
    set({ user, accessToken: token });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        accessToken: token,
        refreshToken: null
      })
    );
  },

  setUser: (user) => {
    set((state) => ({
      user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken
    }));
  },

  setToken: (token) => {
    set((state) => ({
      user: state.user,
      accessToken: token,
      refreshToken: state.refreshToken
    }));
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
    toast.success("Logged out");
  }
}));

export default useAuthStore;


// import toast from "react-hot-toast";
// import { create } from "zustand";
// import authService from "../services/auth";

// const useAuthStore = create((set) => ({
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   loading: false,

//   login: async (mobile, role) => {
//     set({ loading: true });

//     try {
//       const res = await authService.verifyOtp(mobile, role);

//       set({
//         user: res.data.user,
//         accessToken: res.data.accessToken,
//         refreshToken: res.data.refreshToken,
//         loading: false,
//       });

//       localStorage.setItem("token", res.data.accessToken);
//       localStorage.setItem("refreshToken", res.data.refreshToken);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       toast.success(`Welcome ${res.data.user.fullName || res.data.user.shopName || 'User'} Logged in successfully!`);
//       return true;
//     } catch (err) {
//       set({ loading: false });
//       toast.error("Invalid OTP!");
//       return false;
//     }
//   },

//   logout: () => {
//     localStorage.clear();
//     set({ user: null, accessToken: null, refreshToken: null });
//     toast.error("Logged out");
//   }, 
// }));

// export default useAuthStore;