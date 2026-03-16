import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role = null }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signup" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
