import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Login() {
  const [params] = useSearchParams();
  const initialRole = params.get("role"); 
  const [role, setRole] = useState(initialRole || "");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleMobile = (e) => {
    const num = e.target.value.replace(/\D/g, "");
    if (num.length <= 10) setMobile(num);
  };

  useEffect(() => {
    if (initialRole) {

      setRole(initialRole);
    }
  }, [initialRole, navigate])

  const sendOtp = async () => {
    if (!role) return toast.error("Choose Buyer or Seller");
    if (mobile.length !== 10) return toast.error("Enter valid 10-digit number");

    try {
      const res = await api.post("/auth/send-otp", { mobile, role });
      toast.success(res.data?.message || "OTP sent!");

      navigate(`/verify-otp?mobile=${mobile}&role=${role}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';

  // Dynamic styles based on role
  const getGradient = () => {
    if (isBuyer) return "from-blue-600 to-indigo-700";
    if (isSeller) return "from-green-600 to-emerald-700";
    return "from-gray-700 to-gray-900"; // Default
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden font-sans">

      {/* Background Decorative Blobs */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none transition-colors duration-500 bg-gradient-to-br ${getGradient()}`} />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>


      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-8 sm:left-8 text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 hover:opacity-80 transition"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-lg mx-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 relative z-10 transition-all duration-500">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl mb-8 relative">
          <button
            onClick={() => setRole("buyer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${isBuyer ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Buyer
          </button>
          <button
            onClick={() => setRole("seller")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${isSeller ? 'bg-white text-green-600 shadow-sm dark:bg-gray-800 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Seller
          </button>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          <div className={`transition-all duration-500 ${role ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
              Mobile Number
            </label>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${role === 'buyer' ? 'text-blue-500' : role === 'seller' ? 'text-green-500' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                type="text"
                name="mobile"
                id="mobile-input"
                value={mobile}
                onChange={handleMobile}
                placeholder="Enter 10-digit number"
                maxLength={10}
                inputMode="numeric"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:outline-none transition-all dark:text-white font-medium tracking-wide placeholder-gray-400"
                style={{
                  "--tw-ring-color": isBuyer ? "rgb(37 99 235)" : isSeller ? "rgb(22 163 74)" : "gray"
                }}
              />
            </div>
          </div>

          <button
            onClick={sendOtp}
            disabled={mobile.length !== 10 || !role}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isBuyer ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/30' :
                isSeller ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:shadow-green-500/30' :
                  'bg-gray-400'}`}
          >
            {mobile.length === 10 ? "Send OTP Code" : "Enter Mobile Number"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </p>

        </div>

      </div>
    </div>
  );
}