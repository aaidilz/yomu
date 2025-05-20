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

  useEffect(() => {
    const fetchFlashcardCount = async () => {
      const flashcards = await DictionaryService.getUserDictionaries();
      setFlashcardCount(flashcards.length);
    };

    fetchFlashcardCount();
  }, []);

  useEffect(() => {
    const fetchNoteCount = async () => {
      const notes = await NoteService.getUserNotes();
      setNoteCount(notes.length);
    };

    fetchNoteCount();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "おはようございます! 🌅";
    if (hour >= 12 && hour < 18) return "こんにちは! ☀️";
    return "こんばんは! 🌙";
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-[#97C8EB]">
      <div className="max-w-4xl w-full mx-auto px-4 pt-20">
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
            <div className="h-1 w-16 bg-[#64E9EE]/50"></div>
            <p className="text-2xl font-medium text-[#FFFFFF]">
              {getGreeting()}
            </p>
            <div className="h-1 w-16 bg-[#64E9EE]/50"></div>
          </div>

          <p className="text-3xl font-light text-[#64E9EE]">
            {user?.displayName || user?.email}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 rounded-xl p-6 border border-[#64E9EE]/20"
          >
            <h3 className="text-[#13AAFB] text-lg font-semibold mb-2">
              📝 Active Notes
            </h3>
            <p className="text-3xl font-bold text-[#64E9EE]">{noteCount}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 rounded-xl p-6 border border-[#64E9EE]/20"
          >
            <h3 className="text-[#13AAFB] text-lg font-semibold mb-2">
              📚 Active Cards
            </h3>
            <p className="text-3xl font-bold text-[#64E9EE]">
              {flashcardCount}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 rounded-xl p-6 border border-[#64E9EE]/20"
          >
            <h3 className="text-[#13AAFB] text-lg font-semibold mb-2">
              🎯 Current Streak
            </h3>
            <p className="text-3xl font-bold text-[#64E9EE]">7 Days</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
