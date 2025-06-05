import { useEffect, useRef, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AssistantIcon from "@mui/icons-material/Assistant";
import MDEditor from "@uiw/react-md-editor";
import DictionaryService from "../services/DictionaryService";

const apiKey = import.meta.env.VITE_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Prompt sistem (hanya dikirim ke AI, tidak disimpan di chatHistory)
const systemPrompt = `
Kamu adalah Yuki-chan, asisten belajar tentang bahasa Jepang, budaya Jepang, dan tempat-tempat menarik di Jepang. Yang paling utama adalah membantu user belajar bahasa Jepang dengan cara yang santai dan mudah dimengerti. 
Kamu cuma akan menjawab pertanyaan yang berkaitan dengan tiga hal tersebut. Kalau ada yang di luar topik, kamu nggak akan jawab misalnya "maaf yuki...".

Gunakan kata ganti “Yuki” secara natural, misalnya:
- “Yuki bisa bantu…”
- “Yuki gak tahu…”
- “Yuki cuman bisa…”

Batasi penggunaan emoji hanya jika sangat sesuai dan jangan terlalu sering supaya tetap fokus ke penjelasan.

Jawabanmu singkat dan langsung ke inti, tanpa menambahkan kalimat penutup seperti 'Ada pertanyaan lain...' atau ajakan tanya lagi.
Kalau kamu nggak tahu jawabannya, bilang “Maaf ya, Yuki gak tahu.” Tetap sopan ya!

---

Yuki punya akses ke aplikasi Yomu, jadi Yuki bisa menambah data dictionary secara otomatis.  
Tapi sebelum menambahkan, Yuki akan bertanya dulu ke user, misalnya:  
“Apa kamu mau Yuki tambahkan data ini ke dictionary?”  

Kalau user setuju, Yuki akan bilang:  
“Yuki coba nambahkan data ya. Coba refresh ulang browsernya biar muncul”  

Setelah itu, Yuki akan buat keluaran dalam format JSON seperti ini:

{
  "hiragana": "contoh hiragana",
  "kanji": "contoh kanji",
  "katakana": "contoh katakana", # opsional sesuai konteks, berikan "" kalau tidak ada
  "romaji": "contoh romaji",
  "arti": "arti kata atau kalimat",
  "kategori": "Kata benda | Kata sifat | Slang | Bisnis | Umum"
}

Pastikan kategori hanya salah satu dari pilihan tersebut.  
Kalau bukan permintaan jelas untuk membuat data dictionary, Yuki tidak akan buat JSON.  

Ini supaya aplikasi Yomu bisa langsung menyimpan data tersebut otomatis.


`;

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
  chatHistory,
  setChatHistory,
  chatInput,
  setChatInput,
  isChatLoading,
  setChatLoading,
}: ChatLLMProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatLoading]);

  const handleSend = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;

    // Langsung tambahkan pesan user ke history
    const userMessage = { role: "user" as const, text: chatInput };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const limitedHistory = newChatHistory.slice(-10);

      const fullPrompt = [
        systemPrompt,
        ...limitedHistory.map(
          (m) => `${m.role === "user" ? "User" : "AI"}: ${m.text}`
        ),
      ].join("\n\n");

      const result = await ai.models.generateContent({
        model: "gemma-3-27b-it",
        contents: fullPrompt,
      });

      const modelText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";

      const modelMessage = { role: "ai" as const, text: modelText };

      // Coba parsing JSON dari modelText jika ada
      let parsedDict = null;
      try {
        const jsonMatch = modelText.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          parsedDict = JSON.parse(jsonMatch[0]);
        }
      } catch {
        parsedDict = null;
      }

      if (parsedDict) {
        try {
          await DictionaryService.addDictionary(parsedDict);
          setChatHistory([
            ...newChatHistory,
            modelMessage,
            {
              role: "ai",
              text: "Yuki coba nambahkan data ya. Coba cek apakah sudah muncul.",
            },
          ]);
        } catch (error) {
          console.error("Gagal menyimpan dictionary:", error);
          setChatHistory([
            ...newChatHistory,
            modelMessage,
            {
              role: "ai",
              text: "Maaf, Yuki gagal menyimpan data dictionary.",
            },
          ]);
        }
      } else {
        setChatHistory([...newChatHistory, modelMessage]);
      }
    } catch (err) {
      console.error("Error saat generate content:", err);
      setChatHistory([
        ...newChatHistory,
        { role: "ai", text: "Maaf, terjadi kesalahan. Silakan coba lagi." },
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
    setChatHistory,
  ]);

  const clearChat = () => {
    setChatHistory([]);
    setChatInput("");
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

        {chatHistory.map((msg, idx) => (
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
