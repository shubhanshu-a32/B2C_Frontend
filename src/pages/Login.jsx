import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const [params] = useSearchParams();
  const role = params.get("role");
  const nav = useNavigate();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { mobile, role });
      nav(`/otp?mobile=${mobile}&role=${role}`);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-2 text-center">{role} Login</h2>
      <p className="text-gray-600 text-center mb-6">Enter your mobile number to continue</p>


      <Input
        label="Mobile Number"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <Button className="w-full mt-4" onClick={sendOtp} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </div>
  );
}