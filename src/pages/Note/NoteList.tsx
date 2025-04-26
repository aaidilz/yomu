import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteService from "../../services/NoteService";
import AddIcon from "@mui/icons-material/Add";
import NoteItem from "./components/NoteItem";
import { motion } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
}

const ITEMS_PER_PAGE = 6;

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await NoteService.getUserNotes();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await NoteService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Gagal hapus catatan", err);
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const handleEdit = async (id: string) => {
    setLoadingEditId(id);
    try {
      navigate(`/note/edit/${id}`);
    } finally {
      setLoadingEditId(null);
    }
  };

  const preview = (id: string) => {
    setLoadingEditId(id);
    setTimeout(() => {
      navigate(`/note/${id}`);
    }, 400);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-20 flex justify-center items-center flex-col px-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center px-4 mb-6">
        <h1 className="text-3xl font-bold text-[#64E9EE]">Catatan</h1>
        <button
          onClick={() => navigate("/note/new")}
          className="flex items-center bg-[#64E9EE] hover:bg-[#53cbd1] text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          <AddIcon className="mr-2 transform translate-y-[-1px]" />
          Tambah
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl">
        {loading ? (
         <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.4 }}
         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
       >
         {Array.from({ length: 6 }).map((_, i) => (
           <div
             key={i}
             className="h-48 bg-gray-200 rounded-xl animate-pulse"
           ></div>
         ))}
       </motion.div>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg">Catatan gak ditemukan :(</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onPreview={preview}
                  onEdit={handleEdit}
                  onDeleteConfirm={setConfirmDeleteId}
                  loadingEditId={loadingEditId}
                />
              ))}
            </div>

            {/* Pagination - Updated Style */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 my-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-[#64E9EE] rounded-xl text-[#64E9EE] disabled:opacity-50 hover:bg-[#64E9EE]/10 transition-colors"
                >
                  Prev
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 min-w-[44px] border-2 border-[#64E9EE] rounded-xl transition-all ${
                          page === currentPage
                            ? "bg-[#64E9EE] text-white shadow-inner"
                            : "text-[#64E9EE] hover:bg-[#64E9EE]/10"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-[#64E9EE] rounded-xl text-[#64E9EE] disabled:opacity-50 hover:bg-[#64E9EE]/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Hapus */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">
              Yakin ingin menghapus catatan ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
              >
                {deletingId === confirmDeleteId ? "Menghapus..." : "Hapus"}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;
