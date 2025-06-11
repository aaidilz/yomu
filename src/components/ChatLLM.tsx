import { useEffect, useRef, useCallback, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AssistantIcon from "@mui/icons-material/Assistant";
import MDEditor from "@uiw/react-md-editor";
import handleDictionaryIfAny from "./util/handleDictionaryIfAny";
import handleNoteIfAny from "./util/handleNoteIfAny";

const apiKey = import.meta.env.VITE_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

type ChatMessage = { role: "user" | "model" | "ai"; text: string };

interface ChatLLMProps {
  onClose: () => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  isChatLoading: boolean;
  setChatLoading: (loading: boolean) => void;
  mobileUI?: boolean;
}

const ChatLLM = ({
  onClose,
  chatInput,
  setChatInput,
  isChatLoading,
  setChatLoading,
}: ChatLLMProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chatHistory dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // Simpan chatHistory ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  const [systemPrompt, setSystemPrompt] = useState<string>("");

  useEffect(() => {
    fetch("/YukiPrompt.txt")
      .then((res) => res.text())
      .then(setSystemPrompt)
      .catch(() => setSystemPrompt(""));
  }, []);

  // Build prompt correctly with system prompt + truncated history
  const buildPrompt = useCallback(
    (messages: ChatMessage[]): string => {
      const last10Messages = messages.slice(-10);
      return [
        `System: ${systemPrompt}`,
        ...last10Messages.map(
          (m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`
        ),
      ].join("\n\n");
    },
    [systemPrompt]
  );

  const handleSend = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = { role: "user", text: chatInput };
    const updatedHistory = [...chatHistory, userMessage];

    setChatHistory(updatedHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const prompt = buildPrompt(updatedHistory);

      const result = await ai.models.generateContent({
        model: "gemma-3-27b-it",
        contents: prompt,
      });

      const modelText =
        result.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      const modelMessage: ChatMessage = { role: "ai", text: modelText };

      let newHistory = [...updatedHistory, modelMessage];
      setChatHistory(newHistory);

      // Coba ekstrak JSON dari respons model
      const jsonMatch = modelText.match(/\{[\s\S]*?\}/);
      let parsed;
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (err) {
          // Jika JSON-nya invalid, lanjutkan seperti biasa
          console.warn("Gagal parse JSON:", err);
        }
      }

      // Jika berisi title dan content, jalankan handleNoteIfAny
      if (parsed && parsed.title && parsed.content) {
        const noteResult = await handleNoteIfAny(modelText, newHistory);
        if (noteResult.newHistory.length > newHistory.length) {
          newHistory = noteResult.newHistory;
          setChatHistory(newHistory);
        }
      } else if (parsed) {
        // Jika bukan note, tapi JSON valid, coba simpan sebagai dictionary
        const dictResult = await handleDictionaryIfAny(modelText, newHistory);
        if (dictResult.newHistory.length > newHistory.length) {
          newHistory = dictResult.newHistory;
          setChatHistory(newHistory);
        }
      }
    } catch (err) {
      console.error("API error:", err);
      setChatHistory([
        ...updatedHistory,
        { role: "ai", text: "⚠️ Maaf, Yuki lagi error nih. Coba lagi ya?" },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [
    chatInput,
    isChatLoading,
    chatHistory,
    setChatInput,
    setChatLoading,
    buildPrompt,
  ]);
  
  const clearChat = () => {
    setChatHistory([]);
    setChatInput("");
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 text-white p-3">
        <div className="flex items-center">
          <AssistantIcon className="mr-2" />
          <span className="font-bold">AI Assistant</span>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearChat}
            className="p-1 rounded-full hover:bg-gray-500 transition-colors"
            title="Clear chat"
          >
            <DeleteIcon fontSize="small" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-500 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && !isChatLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <AssistantIcon className="text-4xl mb-3 text-gray-400" />
            <h3 className="font-bold text-lg mb-1">Yuki Chan</h3>
            <p className="max-w-xs">Yuki bisa bantu kamu belajar!</p>
          </div>
        )}

        {chatHistory
          .filter((msg) => {
            // sembunyikan pesan JSON (dictionary output)
            try {
              JSON.parse(msg.text);
              return false;
            } catch {
              return true;
            }
          })
          .map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                } shadow-sm`}
              >
                <MDEditor.Markdown
                  source={msg.text}
                  style={{
                    backgroundColor: "transparent",
                    color: msg.role === "user" ? "white" : "inherit",
                  }}
                />
              </div>
            </motion.div>
          ))}

        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-900 bg-gray-900">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Tanyakan Yuki sesuatu..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
        <p className="text-xs text-gray-100 mt-1">Tekan Enter buat ngirim.</p>
      </div>
    </div>
  );
};

export default ChatLLM;
