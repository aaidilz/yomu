import { useEffect, useMemo, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import NoteService from "../../services/NoteService";
import AddIcon from "@mui/icons-material/Add";
import NoteItem from "./components/NoteItem";
import { motion } from "framer-motion";
import { Pagination, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";

interface Note {
  id: string;
  title: string;
  content: string;
}

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handlePreview = (id: string) => {
    setLoadingPreviewId(id);
    setTimeout(() => {
      navigate(`/note/${id}`);
    }, 400);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return notes.filter((f) => f.title.toLowerCase().includes(q));
  }, [searchQuery, notes]);

  const notesPerPage = 6;
  const totalPages = Math.ceil(filtered.length / notesPerPage);

  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * notesPerPage;
    return filtered.slice(startIndex, startIndex + notesPerPage);
  }, [filtered, currentPage]);

  const handleChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-20 flex justify-center items-center flex-col px-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-8">
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

        {/* Search Bar */}
        <div className="w-full bg-gray-800 backdrop-blur-sm p-4 rounded-2xl shadow-xl mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Note..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100 placeholder-gray-400 transition-all"
              />
              <Search className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
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
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-lg">
              Catatan gak ditemukan :(
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedNotes.map((note) => (
                  <NoteItem
                    note={note}
                    onPreview={handlePreview}
                    onEdit={handleEdit}
                    onDeleteConfirm={setConfirmDeleteId}
                    loadingPreviewId={loadingPreviewId}
                    loadingEditId={loadingEditId}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center my-12">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChange}
                    shape="rounded"
                    color="primary"
                    size="large"
                    variant="outlined"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "#64E9EE",
                        borderColor: "#64E9EE",
                      },
                    }}
                  />
                </Stack>
              </div>
            </>
          )}
        </div>

        {/* Modal Hapus */}
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <DialogPanel className="relative bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <DialogTitle className="text-lg font-semibold mb-4">
              Yakin ingin menghapus catatan ini?
            </DialogTitle>
            <Description className="mb-4 text-gray-600">
              Catatan yang dihapus tidak dapat dikembalikan.
            </Description>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
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
          </DialogPanel>
        </Dialog>
      </div>
    </div>
  );
};

export default NoteList;
