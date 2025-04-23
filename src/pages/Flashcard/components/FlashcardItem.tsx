// src/components/FlashcardItem.tsx
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Delete from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

interface Flashcard {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

interface FlashcardItemProps {
  flashcard: Flashcard;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = React.memo(
  ({ flashcard, onEdit, onDelete }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-xl p-4 md:p-6 border border-[#64E9EE]/20 shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
  >
    <div className="flex flex-col space-y-2 flex-grow">
      <div className="text-3xl font-extrabold text-[#64E9EE]">
        {flashcard.kanji}
      </div>
      {flashcard.hiragana && (
        <div className="text-white text-base">
          <strong>Hiragana:</strong> {flashcard.hiragana}
        </div>
      )}
      {flashcard.katakana && (
        <div className="text-white text-base">
          <strong>Katakana:</strong> {flashcard.katakana}
        </div>
      )}
      <div className="flex justify-between items-center pt-1">
        <span className="text-white text-lg font-medium">{flashcard.arti}</span>
        <span className="text-[#64E9EE] italic text-sm">{flashcard.romaji}</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-[#64E9EE]/20">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(flashcard.id)}
          className="text-[#64E9EE] hover:text-white transition"
        >
          <SettingsIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(flashcard.id)}
          className="text-red-400 hover:text-red-200 transition"
        >
          <Delete fontSize="small" />
        </button>
      </div>
    </div>
  </motion.div>
  )
);

export default FlashcardItem;
