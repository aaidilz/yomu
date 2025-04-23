import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import NoteService from "../../services/NoteService";
import { motion, AnimatePresence } from "framer-motion";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

interface Note {
  id?: string;
  title: string;
  content: string;
}

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note>({
    title: "",
    content: "**Tulis catatan Anda di sini...**",
  });
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const notes = await NoteService.getUserNotes();
          const existingNote = notes.find((n) => n.id === id);
          if (existingNote) {
            setNote(existingNote);
          }
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      })();
    }
  }, [id]);

  useEffect(() => {
    const handleResetOverflow = () => {
      document.body.style.overflow = "auto";
    };

    // Memeriksa jika editor masuk ke mode fullscreen
    if (document.querySelector(".w-md-editor-fullscreen")) {
      document.body.style.overflow = "visible";
    } else {
      document.body.style.overflow = "auto";
    }

    // Reset overflow saat navigasi dengan tombol back browser
    window.addEventListener("popstate", handleResetOverflow);

    return () => {
      document.body.style.overflow = "auto"; // Reset saat unmount
      window.removeEventListener("popstate", handleResetOverflow);
    };
  }, [isPreview]); // Bisa diganti dengan state fullscreen jika ada

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (id) {
        await NoteService.updateNote(id, {
          title: note.title,
          content: note.content,
        });
      } else {
        const docRef = await NoteService.addNote({
          title: note.title,
          content: note.content,
        });
        note.id = docRef.id;
      }
      navigate(`/note/${note.id || id}`);
    } catch (error) {
      console.error("Error saving note:", error);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/note")}
          className="flex items-center gap-2 text-[#64E9EE] hover:text-white transition"
        >
          <ArrowBackIcon fontSize="small" />
          Kembali
        </button>
        <h1 className="text-2xl font-bold text-[#64E9EE]">
          {id ? "Edit Catatan" : "Buat Catatan Baru"}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-[#64E9EE] hover:bg-[#4dcfd5] text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          <SaveIcon fontSize="small" />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {/* Form */}
      <input
        type="text"
        placeholder="Judul Catatan..."
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="w-full p-2 mb-4 rounded bg-gray-800 border border-[#64E9EE]/20 text-white placeholder-gray-400"
      />

      <div className="mb-4">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-4 py-2 text-sm rounded-md transition-all
          bg-[#64E9EE]/20 backdrop-blur-sm border border-[#64E9EE]/40
          hover:bg-[#64E9EE]/30 text-white shadow-sm flex items-center gap-2"
        >
          {isPreview ? "Kembali ke Editor" : "Lihat Preview"}
          <motion.div
            animate={{ rotate: isPreview ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowDropUpIcon />
          </motion.div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isPreview ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MDEditor
              value={note.content}
              onChange={(val) => setNote({ ...note, content: val || "" })}
              className="border border-[#64E9EE]/20"
              preview="edit"
              height={400}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MDEditor.Markdown
              source={note.content}
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#1f2937",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid #64E9EE33",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
