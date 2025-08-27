
import { useEffect, useRef, useCallback, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import handleDictionaryIfAny from "./util/handleDictionaryIfAny";
import handleNoteIfAny from "./util/handleNoteIfAny";
import { useTheme } from "../contexts/ThemeContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ChatMessage } from "../components/types/chat";

const apiKey = import.meta.env.VITE_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey });



interface ChatLLMProps {
  onClose: () => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  isChatLoading: boolean;
  setChatLoading: (loading: boolean) => void;
  mobileUI?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatLLM = ({
  onClose,
  chatInput,
  setChatInput,
  isChatLoading,
  setChatLoading,
}: ChatLLMProps) => {
  const { themeMode } = useTheme();
  const isLightMode = themeMode === 'light';
  const messagesEndRef = useRef<HTMLDivElement>(undefined!);

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

  // Pastikan chatHistory tetap tersimpan saat keluar/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
          (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`
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
        model: "gemma-3n-e4b-it",
        contents: prompt,
      });

      const modelText =
        result.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  const modelMessage: ChatMessage = { role: "assistant", text: modelText };

      let newHistory = [...updatedHistory, modelMessage];
      setChatHistory(newHistory);

      // ekstrak JSON dari respons model
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
  { role: "assistant", text: "⚠️ Maaf, Yuki lagi error nih. Coba lagi ya?" },
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
    <div className={`flex flex-col h-full ${isLightMode ? 'bg-gray-100' : 'bg-gray-800'}`}>
      <ChatHeader isLightMode={isLightMode} onClear={clearChat} onClose={onClose} />
      <ChatMessages isLightMode={isLightMode} chatHistory={chatHistory} isChatLoading={isChatLoading} messagesEndRef={messagesEndRef} />
      <ChatInput isLightMode={isLightMode} chatInput={chatInput} setChatInput={setChatInput} isChatLoading={isChatLoading} handleSend={handleSend} />
    </div>
  );
};

export default ChatLLM;
