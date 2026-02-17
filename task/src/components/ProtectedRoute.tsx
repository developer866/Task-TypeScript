import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../app/store";
import type { ReactNode } from "react";
import { toast } from "react-toastify";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return (
      <div>
        {toast.error("Login/Register")}
        <Navigate to="/login" replace />;
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
