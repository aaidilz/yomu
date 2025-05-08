import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import Navbars from "./Navbar";
import LoopIcon from "@mui/icons-material/Loop";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: ReactNode;
  load?: () => Promise<void>;
}

const ProtectedRoute = ({ children, load }: ProtectedRouteProps) => {
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (load) {
        await load();
      } else {
        await new Promise((r) => setTimeout(r, 500)); // fallback
      }
      setLoading(false);
    };

    if (user && !authLoading) {
      loadData();
    }
  }, [user, authLoading, load]);

  if (authLoading || loading) {
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
