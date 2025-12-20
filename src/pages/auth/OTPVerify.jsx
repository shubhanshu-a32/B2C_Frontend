// src/pages/auth/OTPVerify.jsx
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

      // Use login function if available
      if (typeof loginFn === "function") {
        try {
          // many stores accept (user, token)
          await loginFn(user, token);
        } catch (err) {
          // fallback to setting separately
          if (typeof setUser === "function") setUser(user);
          if (typeof setToken === "function") setToken(token);
        }
      } else {
        // fallback: try direct setters
        if (typeof setUser === "function") setUser(user);
        if (typeof setToken === "function") setToken(token);
      }

      // persist (optional) — if your store doesn't persist, do it here
      try {
        localStorage.setItem("b2c_auth_v1", JSON.stringify({ user, token, refresh }));
      } catch (e) { }

      toast.success("Logged in");
      // navigate after auth is set
      navigate(role === "buyer" ? "/buyer/dashboard" : "/seller/dashboard");
    } catch (err) {
      // show server message if available
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Link
        to="/"
        className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-bold text-blue-600 dark:text-blue-400"
      >
        B2C Website
      </Link>
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
          OTP sent to <strong>{mobile}</strong>
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
          maxLength={6}
          className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:border-gray-600"
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white p-2 rounded`}
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
    </div>
  );
}


// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import api from "../../services/api";
// import useAuthStore from "../../store/authStore";

// export default function OTPVerify() {
//   const [params] = useSearchParams();
//   const mobile = params.get("mobile");
//   const role = params.get("role");

//   const navigate = useNavigate();
//   const login = useAuthStore((s) => s.login);

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!mobile || !role) {
//       toast.error("Invalid session. Start login again.");
//       navigate("/login");
//     }
//   }, [mobile, role, navigate]);

//   const verifyOtp = async () => {
//     if (otp.length < 4) return toast.error("Enter valid OTP");

//     setLoading(true);

//     try {
//       const res = await api.post("/auth/verify-otp", { mobile, otp, role });

//       // backend returns { user, accessToken }
//       const user = res.data.user;
//       const token = res.data.accessToken;

//       if (!user || !token) {
//         toast.error("Invalid server response");
//         return;
//       }

//       login(user, token);
//       toast.success("Logged in Successfully!");

//       navigate(role === "buyer" ? "/buyer/dashboard" : "/seller/dashboard");
//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
//       <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow">
//         <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>

//         <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
//           OTP sent to <b>{mobile}</b>
//         </p>

//         <input
//           value={otp}
//           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//           placeholder="Enter OTP"
//           maxLength={6}
//           className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:border-gray-600"
//         />

//         <button
//           onClick={verifyOtp}
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../services/api";
// import useAuthStore from "../../store/authStore";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";

// export default function OTPVerify() {
//   const [params] = useSearchParams();
//   const mobile = params.get("mobile");
//   const role = params.get("role");
//   const navigate = useNavigate();

//   const login = useAuthStore((s) => s.login);   // clean login action

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   const verify = async () => {
//     // Validate mobile
//     if (!mobile) {
//       toast.error("Missing mobile number. Start login again.");
//       return;
//     }

//     // Validate OTP
//     if (!otp || otp.trim().length < 4) {
//       toast.error("Enter a valid OTP");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await api.post("/auth/verify-otp", { mobile, otp, role });

//       // Expected backend shape:
//       // { user: {...}, token: "xxxx" }
//       if (!res.data?.user || !res.data?.token) {
//         toast.error("Invalid server response");
//         setLoading(false);
//         return;
//       }

//       // Login into Zustand store
//       try {
//         login(res.data.user, res.data.token); // Ensure your store supports this
//       } catch (e) {
//         console.error("Auth store login error:", e);
//         toast.error("Failed to store login session");
//         setLoading(false);
//         return;
//       }

//       toast.success("Logged in");

//       // Redirect user based on role
//       if (role === "buyer") navigate("/buyer/dashboard");
//       else navigate("/seller/dashboard");

//     } catch (err) {
//       console.error("OTP verify error:", err?.response?.data || err);
//       toast.error(err?.response?.data?.message || "Invalid or expired OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-sm mx-auto mt-24">
//       <h2 className="text-3xl font-bold mb-2 text-center">Verify OTP</h2>
//       <p className="text-gray-600 text-center mb-6">
//         A 6-digit OTP was sent to <strong>{mobile}</strong>
//       </p>

//       <Input
//         label="OTP"
//         placeholder="6-digit OTP"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only numbers
//         maxLength={6}
//       />

//       <Button
//         className="w-full mt-4"
//         onClick={verify}
//         disabled={loading}
//         loading={loading}
//       >
//         {loading ? "Verifying..." : "Verify OTP"}
//       </Button>
//     </div>
//   );
// }