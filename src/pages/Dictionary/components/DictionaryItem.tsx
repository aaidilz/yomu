// src/components/DictionaryItem.tsx
import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Delete from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";

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
  ({ dictionary, onEdit, onDelete }) => {
    const { themeMode } = useTheme();
    const isLightMode = themeMode === "light";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl p-4 border shadow-lg hover:shadow-2xl transition-shadow ${
          isLightMode 
            ? 'bg-white border-gray-200' 
            : 'bg-gray-800 border-[#64E9EE]/20'
        }`}
      >
        <div className="flex flex-col space-y-2 flex-grow">
          <div className={`text-3xl font-extrabold ${
            isLightMode ? 'text-normal' : 'text-[#64E9EE]'
          }`}>
            {dictionary.kanji}
          </div>
          {dictionary.hiragana && (
            <div className={`text-base ${isLightMode ? 'text-gray-700' : 'text-white'}`}>
              <strong>Hiragana:</strong> {dictionary.hiragana}
            </div>
          )}
          {dictionary.katakana && (
            <div className={`text-base ${isLightMode ? 'text-gray-700' : 'text-white'}`}>
              <strong>Katakana:</strong> {dictionary.katakana}
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className={`text-lg font-medium ${
              isLightMode ? 'text-gray-800' : 'text-white'
            }`}>
              {dictionary.arti}
            </span>
            <span className={`italic text-sm ${
              isLightMode ? 'text-gray-500' : 'text-[#64E9EE]'
            }`}>
              {dictionary.romaji}
            </span>
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t ${
          isLightMode ? 'border-gray-200' : 'border-[#64E9EE]/20'
        }`}>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(dictionary.id)}
              className={`transition ${
                isLightMode 
                  ? 'text-blue-600 hover:text-blue-800' 
                  : 'text-[#64E9EE] hover:text-white'
              }`}
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
    );
  }
);

export default DictionaryItem;
