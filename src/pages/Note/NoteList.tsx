import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteService from "../../services/NoteService";
import AddIcon from "@mui/icons-material/Add";
import NoteItem from "./components/NoteItem";
import { motion } from "framer-motion";
import { Pagination, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import Swal from "sweetalert2";

interface Note {
  id: string;
  title: string;
  content: string;
}

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setDeletingId] = useState<string | null>(null);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Note List | Yomu";
  }, []);

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

  const onDeleteConfirm = async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus catatan ini?",
      text: "Catatan yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      background: "#0f172a",
      color: "#fff",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await NoteService.deleteNote(id);
        setNotes((prev) => prev.filter((n) => n.id !== id));
        await Swal.fire({
          title: "Berhasil!",
          text: "Catatan berhasil dihapus.",
          icon: "success",
          background: "#0f172a",
          color: "#fff",
        });
      } catch (err) {
        console.error("Gagal hapus catatan", err);
        await Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus.",
          icon: "error",
          background: "#0f172a",
          color: "#fff",
        });
      }
      setDeletingId(null);
    }
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
        <div className="flex justify-between items-center w-full mb-8">
          <h1 className="text-3xl font-bold text-[#64E9EE] drop-shadow-lg">
            Note
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/note/new")}
              className="flex items-center bg-[#64E9EE] hover:bg-[#53cbd1] text-black px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <AddIcon className="mr-2 transform translate-y-[-1px]" />
              Tambah
            </button>
          </div>
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
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Data tidak ada ditemukan :(
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onPreview={handlePreview}
                    onEdit={handleEdit}
                    onDelete={onDeleteConfirm}
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
      </div>
    </div>
  );
};

export default NoteList;
