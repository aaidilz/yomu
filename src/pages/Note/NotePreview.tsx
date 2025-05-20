import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import NoteService from "../../services/NoteService";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);

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
      <div className="container mx-auto p-4 text-[#97C8EB]">Memuat...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen mt-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-8 md:mt-12 space-y-4 md:space-y-0">
        <div className="md:border-r-2 md:border-[#64E9EE] pr-6">
          <h1 className="text-2xl font-bold text-[#64E9EE] mb-2">
            {note.title}
          </h1>
        </div>

        <div className="flex space-x-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/note")}
            className="bg-[#64E9EE] hover:bg-[#53cbd1] text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Kembali
          </button>
          {/* Edit Button */}
          <button
            onClick={() => navigate(`/note/edit/${note.id}`)}
            className="bg-[#13AAFB] hover:bg-[#0F8AC4] text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Edit Catatan
          </button>
        </div>
      </div>

      {/* Content Section */}
      <MDEditor.Markdown
        source={note.content}
        style={{
          backgroundColor: "#1f2937", // Tailwind: bg-gray-800
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border: "1px solid #64E9EE33",
          color: "#f9fafb", // Tailwind: text-gray-100
          lineHeight: "1.75",
          fontSize: "1rem", // Tailwind: text-base
          overflowWrap: "break-word",
        }}
      />
    </div>
  );
}
