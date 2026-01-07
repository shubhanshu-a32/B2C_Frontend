import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import useAuthStore from "../../store/authStore";

export default function OTPVerify() {
  const [params] = useSearchParams();
  const mobile = params.get("mobile");
  const role = params.get("role");
  const navigate = useNavigate();

  // Prefer direct function from store; may be undefined in some stores
  const loginFn = useAuthStore((s) => s.login);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobile || !role) {
      toast.error("Missing mobile or role — start login again.");
      navigate("/login");
    }
  }, [mobile, role, navigate]);

  const verifyOtp = async () => {
    if (loading) return; // prevent double submits
    if (!otp || otp.trim().length < 4) {
      toast.error("Enter a valid OTP");
      return;
    }

    setLoading(true);
    const payload = { mobile, role, otp: otp.trim() };
    console.log("→ verify-otp payload:", payload);

    try {
      const res = await api.post("/auth/verify-otp", payload);
      console.log("verify-otp success:", res.data);

      // Accept many backend shapes
      const user = res.data?.user || res.data?.data?.user || res.data;
      const token = res.data?.accessToken || res.data?.token || res.data?.access_token || null;
      const refresh = res.data?.refreshToken || res.data?.refresh_token || null;

      // If backend returned an error shape unexpectedly, guard:
      if (!user && !token) {
        // Attempt to show useful server message
        const serverMsg = res.data?.message || "Unexpected server response";
        toast.error(serverMsg);
        setLoading(false);
        return;
      }

      // Use setAuth from store if available (preferred for full persistence)
      const setAuth = useAuthStore.getState().setAuth;

      if (typeof setAuth === "function") {
        setAuth(user, token, refresh);
      } else if (typeof loginFn === "function") {
        await loginFn(user, token);
      } else {
        // fallback
        if (typeof setUser === "function") setUser(user);
        if (typeof setToken === "function") setToken(token);
      }

      try {
        localStorage.setItem("b2c_auth_v1", JSON.stringify({
          user,
          accessToken: token,
          refreshToken: refresh
        }));
      } catch (e) { }

      toast.success("Logged in");
      navigate(role === "buyer" ? "/buyer/shop" : "/seller/dashboard");
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message || "OTP verification failed";
      console.error("verify-otp error response:", {
        status: err?.response?.status,
        data: err?.response?.data,
        payloadSent: payload,
      });
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';

  // Dynamic styles based on role
  const getGradient = () => {
    if (isBuyer) return "from-blue-600 to-indigo-700";
    if (isSeller) return "from-green-600 to-emerald-700";
    return "from-gray-700 to-gray-900";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden font-sans">

      {/* Background Decorative Blobs */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none transition-colors duration-500 bg-gradient-to-br ${getGradient()}`} />
      <div className="absolute top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <Link
        to="/login"
        className="absolute top-8 left-8 text-lg font-bold flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Login
      </Link>

      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 relative z-10">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br ${isBuyer ? 'from-blue-100 to-blue-200 text-blue-600' : 'from-green-100 to-green-200 text-green-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Verify OTP</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            We sent a verification code to <br />
            <span className="font-bold text-gray-800 dark:text-gray-200 text-base">{mobile}</span>
          </p>
        </div>


        <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="space-y-6">
          <div className="relative">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoFocus
              className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:outline-none transition-all dark:text-white"
              style={{
                "--tw-ring-color": isBuyer ? "rgb(37 99 235)" : isSeller ? "rgb(22 163 74)" : "gray"
              }}
            />
          </div>

          <button
            type="submit"
            onClick={verifyOtp}
            disabled={loading || otp.length < 4}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${isBuyer ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/30' :
                isSeller ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:shadow-green-500/30' :
                  'bg-gray-400'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : "Verify & Login"}
          </button>

          <div className="text-center">
            <button onClick={() => toast.success("OTP Resent!")} className="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition">
              Didn't receive code? Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}