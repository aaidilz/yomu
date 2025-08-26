import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  isLightMode: boolean;
  chatInput: string;
  setChatInput: (input: string) => void;
  isChatLoading: boolean;
  handleSend: () => void;
}

const ChatInput = ({ isLightMode, chatInput, setChatInput, isChatLoading, handleSend }: ChatInputProps) => (
  <div className={`p-3 border-t ${isLightMode ? 'border-gray-200 bg-white' : 'border-gray-900 bg-gray-900'}`}>
    <div className="flex items-center gap-2">
      <input
        type="text"
        className={`flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLightMode ? 'border-gray-300 bg-white text-gray-800 placeholder-gray-500' : 'border-gray-800 bg-gray-800 text-white placeholder-gray-400'}`}
        placeholder="Tanyakan Yuki sesuatu..."
        value={chatInput}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSend()}
        disabled={isChatLoading}
      />
      <motion.button
        onClick={handleSend}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl shadow hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!chatInput.trim() || isChatLoading}
      >
        <SendIcon />
      </motion.button>
    </div>
  </div>
);

export default ChatInput;
