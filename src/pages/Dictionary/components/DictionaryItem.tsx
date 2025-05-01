// src/components/DictionaryItem.tsx
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Delete from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

interface Dictionary {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

interface DictionaryItemProps {
  dictionary: Dictionary;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DictionaryItem: React.FC<DictionaryItemProps> = React.memo(
  ({ dictionary, onEdit, onDelete }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-xl p-4 md:p-6 border border-[#64E9EE]/20 shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
  >
    <div className="flex flex-col space-y-2 flex-grow">
      <div className="text-3xl font-extrabold text-[#64E9EE]">
        {dictionary.kanji}
      </div>
      {dictionary.hiragana && (
        <div className="text-white text-base">
          <strong>Hiragana:</strong> {dictionary.hiragana}
        </div>
      )}
      {dictionary.katakana && (
        <div className="text-white text-base">
          <strong>Katakana:</strong> {dictionary.katakana}
        </div>
      )}
      <div className="flex justify-between items-center pt-1">
        <span className="text-white text-lg font-medium">{dictionary.arti}</span>
        <span className="text-[#64E9EE] italic text-sm">{dictionary.romaji}</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-[#64E9EE]/20">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(dictionary.id)}
          className="text-[#64E9EE] hover:text-white transition"
        >
          <SettingsIcon fontSize="small" />
        </button>
        <button
          onClick={() => onDelete(dictionary.id)}
          className="text-red-400 hover:text-red-200 transition"
        >
          <Delete fontSize="small" />
        </button>
      </div>
    </div>
  </motion.div>
  )
);

export default DictionaryItem;
