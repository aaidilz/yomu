// src/components/NoteItem.tsx
import React from "react";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import { Loop, Settings, Visibility } from "@mui/icons-material";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteItemProps {
  note: Note;
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  loadingPreviewId: string | null;
  loadingEditId: string | null;
}

const NoteItem: React.FC<NoteItemProps> = React.memo(
  ({ note, onPreview, onEdit, onDeleteConfirm, loadingEditId, loadingPreviewId }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800 rounded-xl p-4 md:p-6 border border-[#64E9EE]/20 shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col"
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#64E9EE] mb-2">
              {note.title}
            </h2>
            <p className="text-white text-sm whitespace-pre-wrap line-clamp-4">
              {note.content}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => onPreview(note.id)}
              disabled={loadingPreviewId === note.id}
              className="text-[#64E9EE] hover:text-white transition disabled:opacity-50"
              title="Preview"
            >
              {loadingPreviewId === note.id ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loop fontSize="small" />
                </motion.div>
              ) : (
                <Visibility fontSize="small" />
              )}
            </button>
            <button
              onClick={() => onEdit(note.id)}
              disabled={loadingEditId === note.id}
              className="text-[#64E9EE] hover:text-white transition disabled:opacity-50"
              title="Edit"
            >
              {loadingEditId === note.id ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loop fontSize="small" />
                </motion.div>
              ) : (
                <Settings fontSize="small" />
              )}
            </button>
            <button
              onClick={() => onDeleteConfirm(note.id)}
              className="text-red-400 hover:text-red-200 transition"
              title="Delete"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default NoteItem;
