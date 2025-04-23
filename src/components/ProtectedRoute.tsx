import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import Navbars from "./Navbars";
import LoopIcon from "@mui/icons-material/Loop";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <LoopIcon style={{ fontSize: 100, color: "white" }} />
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbars />
      {children}
    </>
  );
};

export default ProtectedRoute;
