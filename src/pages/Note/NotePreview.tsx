import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import NoteService from "../../services/NoteService";
import { useTheme } from "../../contexts/ThemeContext";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";

  useEffect(() => {
    document.title = "Note Preview | Yomu";
  }, []);

  useEffect(() => {
    async function fetchNote() {
      try {
        const notes = await NoteService.getUserNotes();
        const found = notes.find((n) => n.id === id);
        if (found) setNote(found);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    }
    fetchNote();
  }, [id]);

  if (!note) {
    return (
      <div className={`container mx-auto p-4 ${isLightMode ? 'text-gray-600' : 'text-[#97C8EB]'}`}>Memuat...</div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto p-4 md:p-6 min-h-screen mt-10 ${
      isLightMode ? 'bg-gray-50' : 'bg-[#001011]'
    }`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-8 md:mt-12 space-y-4 md:space-y-0">
        <div className={`md:border-r-2 pr-6 ${
          isLightMode ? 'md:border-blue-400' : 'md:border-[#64E9EE]'
        }`}>
          <h1 className={`text-2xl font-bold mb-2 ${
            isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'
          }`}>
            {note.title}
          </h1>
        </div>

        <div className="flex space-x-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/note")}
            className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
              isLightMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-[#64E9EE] hover:bg-[#53cbd1] text-white'
            }`}
          >
            Kembali
          </button>
          {/* Edit Button */}
          <button
            onClick={() => navigate(`/note/edit/${note.id}`)}
            className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
              isLightMode
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-[#13AAFB] hover:bg-[#0F8AC4] text-white'
            }`}
          >
            Edit Catatan
          </button>
        </div>
      </div>

      {/* Content Section */}
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
    </div>
  );
}
