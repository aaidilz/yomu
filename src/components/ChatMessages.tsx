import { motion } from "framer-motion";
import AssistantIcon from "@mui/icons-material/Assistant";
import MDEditor from "@uiw/react-md-editor";
import { ChatMessage } from "../types/chat";
import { RefObject } from "react";

interface ChatMessagesProps {
  isLightMode: boolean;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const ChatMessages = ({ isLightMode, chatHistory, isChatLoading, messagesEndRef }: ChatMessagesProps) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {chatHistory.length === 0 && !isChatLoading && (
      <div className={`flex flex-col items-center justify-center h-full text-center ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <AssistantIcon className={`text-4xl mb-3 ${isLightMode ? 'text-gray-400' : 'text-gray-400'}`} />
        <h3 className="font-bold text-lg mb-1">Yuki Chan</h3>
        <p className="max-w-xs">Yuki bisa bantu kamu belajar!</p>
      </div>
    )}

    {chatHistory.filter(msg => msg.display !== false).map((msg, idx) => (
      <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none" : isLightMode ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none" : "bg-gray-700 text-white border border-gray-600 rounded-bl-none"} shadow-sm`}>
          <MDEditor.Markdown source={msg.text} style={{ backgroundColor: "transparent", color: msg.role === "user" ? "white" : isLightMode ? "inherit" : "white" }} />
        </div>
      </motion.div>
    ))}

    {isChatLoading && (
      <div className="flex justify-start">
        <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${isLightMode ? 'bg-white text-gray-800 border border-gray-200' : 'bg-gray-700 text-white border border-gray-600'}`}>
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isLightMode ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse delay-150 ${isLightMode ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse delay-300 ${isLightMode ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessages;
