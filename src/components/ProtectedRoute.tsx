import { Navigate } from "react-router-dom";
import { memo, ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import Navbars from "./Navbar";
import LoopIcon from "@mui/icons-material/Loop";
import { motion } from "framer-motion";
import AssistantIcon from "@mui/icons-material/Assistant";
import ChatLLM from "../components/ChatLLM";

interface ProtectedRouteProps {
  children: ReactNode;
  load?: () => Promise<void>;
}

const ProtectedRoute = ({ children, load }: ProtectedRouteProps) => {
  const [user, authLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // State untuk menyimpan percakapan
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "model"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (load) {
        await load();
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      setLoading(false);
    };

    if (!authLoading) {
      if (user) {
        loadData();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, load]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
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

      {/* Floating AI Chat Button */}
      <motion.button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AssistantIcon />
      </motion.button>

      {/* Chat Window */}
      <motion.div
        className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl rounded-xl z-50 overflow-hidden border border-gray-00 flex flex-col"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: showChat ? 1 : 0,
          scale: showChat ? 1 : 0.8,
          y: showChat ? 0 : 20,
        }}
        style={{
          pointerEvents: showChat ? "auto" : "none",
          display: showChat ? "flex" : "none",
        }}
      >
        <ChatLLM
          onClose={() => setShowChat(false)}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isChatLoading={isChatLoading}
          setChatLoading={setChatLoading}
        />
      </motion.div>
    </>
  );
};

export default memo(ProtectedRoute);
