import api from "./api";

export const authService = {
  sendOtp: (mobile, role) => {
    return api.post("/auth/send-otp", { mobile, role });
  },
  
  verifyOtp: (mobile, otp, role, extra = {}) => {
    return api.post("/auth/verify-otp", { mobile, otp, role, ...extra });
  },

  refreshToken: (refreshToken) => {
    return api.post("/auth/refresh", { refreshToken });
  },

  logout: (userId) => {
    return api.post("/auth/logout", { userId });
  }
};

export default authService;
