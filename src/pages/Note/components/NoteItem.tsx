// src/components/NoteItem.tsx
import React from "react";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Visibility } from "@mui/icons-material";

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
  loadingEditId: string | null;
}

const NoteItem: React.FC<NoteItemProps> = React.memo(
  ({ note, onPreview, onEdit, onDeleteConfirm, loadingEditId }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-xl p-4 border border-[#64E9EE]/20 shadow-lg hover:shadow-2xl transition-shadow"
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
              disabled={loadingEditId === note.id}
              className="text-[#64E9EE] hover:text-white transition disabled:opacity-50"
              title="Preview"
            >
              {loadingEditId === note.id ? (
                <span>⏳</span>
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
                <span>⏳</span>
              ) : (
                <EditIcon fontSize="small" />
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
