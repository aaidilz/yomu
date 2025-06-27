import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import NoteService from "../../services/NoteService";
import { motion, AnimatePresence } from "framer-motion";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { Title } from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";

  useEffect(() => {
    document.title = "Note Editor | Yomu";
  }, []);

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
    <div className={`max-w-7xl mx-auto px-4 pt-24 ${isLightMode ? 'text-gray-800' : 'text-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/note")}
          className={`flex items-center gap-2 transition ${
            isLightMode 
              ? 'text-blue-600 hover:text-blue-800' 
              : 'text-[#64E9EE] hover:text-white'
          }`}
        >
          <ArrowBackIcon fontSize="small" />
          Kembali
        </button>
        <h1 className={`text-2xl font-bold ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}>
          {id ? "Edit Catatan" : "Buat Catatan Baru"}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition disabled:opacity-50 ${
            isLightMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-[#64E9EE] hover:bg-[#4dcfd5] text-black'
          }`}
        >
          <SaveIcon fontSize="small" style={{ color: isLightMode ? "white" : "black" }} />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {/* Form */}
      <div className={`w-full backdrop-blur-sm p-4 rounded-2xl shadow-xl mb-8 ${
        isLightMode ? 'bg-white border border-gray-200' : 'bg-gray-800'
      }`}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Judul Catatan..."
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                isLightMode
                  ? 'border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-50 text-gray-900 placeholder-gray-500'
                  : 'border-gray-700 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100 placeholder-gray-400'
              }`}
            />
            <Title className={`h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 ${
              isLightMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-4 py-2 text-sm rounded-md transition-all border shadow-sm flex items-center gap-2 ${
            isLightMode
              ? 'bg-white border-blue-300 hover:bg-blue-50 text-blue-600'
              : 'bg-gray-800 backdrop-blur-sm border-[#64E9EE]/40 hover:bg-[#64E9EE]/30 text-white'
          }`}
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
              className={`border ${isLightMode ? 'border-blue-200' : 'border-[#64E9EE]/20'}`}
              preview="edit"
              height={400}
              data-color-mode={isLightMode ? "light" : "dark"}
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
                backgroundColor: isLightMode ? "#ffffff" : "#1f2937",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: isLightMode ? "1px solid #e5e7eb" : "1px solid #64E9EE33",
                color: isLightMode ? "#1f2937" : "#f9fafb",
                lineHeight: "1.75",
                fontSize: "1rem",
                overflowWrap: "break-word",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
