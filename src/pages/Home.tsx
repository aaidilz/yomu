import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DictionaryService from "../services/DictionaryService";
import NoteService from "../services/NoteService";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const [user] = useAuthState(auth);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";
  
  useEffect(() => {
    document.title = "Home | Yomu";
  }, []);
 
  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const flashcards = await DictionaryService.getUserDictionaries();
        const notes = await NoteService.getUserNotes();
        setFlashcardCount(flashcards.length);
        setNoteCount(notes.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "おはようございます! 🌅";
    if (hour >= 12 && hour < 18) return "こんにちは! ☀️";
    return "こんばんは! 🌙";
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative ${isLightMode ? 'text-gray-800 bg-gray-50' : 'text-[#97C8EB] bg-gray-900'}`}>
      <div className="max-w-4xl w-full mx-auto px-4 pt-20 pb-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className={`text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${isLightMode ? 'from-blue-600 to-blue-400' : 'from-[#64E9EE] to-[#13AAFB]'}`}>
            ようこそ
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <div className={`h-1 w-16 ${isLightMode ? 'bg-blue-400/50' : 'bg-[#64E9EE]/50'}`} />
            <p className={`text-2xl font-medium ${isLightMode ? 'text-gray-800' : 'text-white'}`}>{getGreeting()}</p>
            <div className={`h-1 w-16 ${isLightMode ? 'bg-blue-400/50' : 'bg-[#64E9EE]/50'}`} />
          </div>

          <p className={`text-3xl font-light ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}>
            {user?.displayName || user?.email}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "📝 Active Notes", value: noteCount },
            { title: "📚 Active Cards", value: flashcardCount },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-xl p-6 border transition-colors ${
                isLightMode 
                  ? 'bg-white border-blue-200 hover:border-blue-400' 
                  : 'bg-gray-800 border-[#64E9EE]/20 hover:border-[#64E9EE]/40'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isLightMode ? 'text-blue-600' : 'text-[#13AAFB]'}`}>
                {stat.title}
              </h3>
              <p className={`text-3xl font-bold ${isLightMode ? 'text-blue-700' : 'text-[#64E9EE]'}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
