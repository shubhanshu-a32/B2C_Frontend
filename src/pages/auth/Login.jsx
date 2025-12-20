import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Login() {
  const [params] = useSearchParams();
  const initialRole = params.get("role"); // "buyer" or "seller" or null
  const [role, setRole] = useState(initialRole || "");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  // Allow only digits, max 10
  const handleMobile = (e) => {
    const num = e.target.value.replace(/\D/g, "");
    if (num.length <= 10) setMobile(num);
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">

      <Link
        to="/"
        className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-bold text-blue-600 dark:text-blue-400"
      >
        B2C Website
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Role Selection */}
        {!initialRole && (
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setRole("buyer")}
              className={`px-4 py-2 rounded ${role === "buyer" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              Buyer
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`px-4 py-2 rounded ${role === "seller" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              Seller
            </button>
          </div>
        )}

        {role && (
          <p className="text-center mb-3 text-sm">
            Logging in as <b>{role.toUpperCase()}</b>
          </p>
        )}

        <label className="text-sm font-semibold">Mobile Number</label>
        <input
          type="text"
          value={mobile}
          onChange={handleMobile}
          placeholder="10-digit mobile"
          maxLength={10}
          inputMode="numeric"
          className="w-full border p-2 rounded mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={sendOtp}
          disabled={mobile.length !== 10}
          className={`w-full mt-4 p-2 rounded text-white transition 
          ${mobile.length === 10 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Send OTP
        </button>

      </div>
    </div>
  );
}