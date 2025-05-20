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
  onDelete: (id: string) => void;
  loadingPreviewId: string | null;
  loadingEditId: string | null;
}

const NoteItem: React.FC<NoteItemProps> = React.memo(
  ({
    note,
    onPreview,
    onEdit,
    onDelete,
    loadingEditId,
    loadingPreviewId,
  }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-xl p-4 border border-[#64E9EE]/20 shadow-lg hover:shadow-2xl transition-shadow min-h-[240px]"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold text-[#64E9EE]">{note.title}</h2>
            <p className="text-white text-sm whitespace-pre-wrap line-clamp-4">
              {note.content}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-[#64E9EE]/20">
            <button
              onClick={() => onPreview(note.id)}
              disabled={loadingPreviewId === note.id}
              className="text-[#64E9EE] hover:text-white transition disabled:opacity-50"
              title="Preview"
            >
              {loadingPreviewId === note.id ? (
                <motion.div
                  animate={{ rotate: -360 }}
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
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loop fontSize="small" />
                </motion.div>
              ) : (
                <Settings fontSize="small" />
              )}
            </button>
            <button
              onClick={() => onDelete(note.id)}
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
