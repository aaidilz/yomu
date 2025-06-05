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
  type ChatMessage = { role: "user" | "model" | "ai"; text: string };
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
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

      {/* Floating Chat Button (common for both) */}
      <motion.button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white p-4 md:p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AssistantIcon className="w-6 h-6 md:w-8 md:h-8" />
      </motion.button>

      {/* Desktop Chat Window */}
      <div className="hidden md:block">
        <motion.div
          className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl rounded-xl z-50 overflow-hidden border border-gray-700 flex flex-col"
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
      </div>

      {/* Mobile Chat Window */}
      <div className="md:hidden">
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: showChat ? 0.75 : 0 }}
          style={{ display: showChat ? "block" : "none" }}
          onClick={() => setShowChat(false)}
        />

        <motion.div
          className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white shadow-2xl rounded-t-2xl z-50 overflow-hidden flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: showChat ? "0%" : "100%" }}
          transition={{ type: "linear", duration: 0.3 }}
        >
          <ChatLLM
            onClose={() => setShowChat(false)}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isChatLoading={isChatLoading}
            setChatLoading={setChatLoading}
            mobileUI={true}
          />
        </motion.div>
      </div>
    </>
  );
};

export default memo(ProtectedRoute);
