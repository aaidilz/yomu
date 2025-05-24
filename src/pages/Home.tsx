import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DictionaryService from "../services/DictionaryService";
import NoteService from "../services/NoteService";

export default function Home() {
  const [user] = useAuthState(auth);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

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
    <div className="min-h-screen flex items-center justify-center text-[#97C8EB] relative">
      <div className="max-w-4xl w-full mx-auto px-4 pt-20 pb-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#64E9EE] to-[#13AAFB] bg-clip-text text-transparent">
            ようこそ
          </h1>

          <div className="flex items-center justify-center space-x-4">
            <div className="h-1 w-16 bg-[#64E9EE]/50" />
            <p className="text-2xl font-medium text-white">{getGreeting()}</p>
            <div className="h-1 w-16 bg-[#64E9EE]/50" />
          </div>

          <p className="text-3xl font-light text-[#64E9EE]">
            {user?.displayName || user?.email}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "📝 Active Notes", value: noteCount },
            { title: "📚 Active Cards", value: flashcardCount },
            { title: "🎯 Current Streak", value: "7 Days" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gray-900 rounded-xl p-6 border border-[#64E9EE]/20 hover:border-[#64E9EE]/40 transition-colors"
            >
              <h3 className="text-[#13AAFB] text-lg font-semibold mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-[#64E9EE]">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
