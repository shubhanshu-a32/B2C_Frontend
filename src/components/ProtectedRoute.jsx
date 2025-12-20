import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function ProtectedRoute({ children, role }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to={`/login?role=${role || "buyer"}`} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard"} replace />;
  }

  return children;
}