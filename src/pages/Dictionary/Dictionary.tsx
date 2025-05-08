import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import DictionaryService from "../../services/DictionaryService";
import { auth } from "../../configs/firebase-config";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import DictionaryItem from "./components/DictionaryItem";

interface Dictionary {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

const ITEMS_PER_PAGE = 6;

const Dictionary: React.FC = () => {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDictionaries = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await DictionaryService.getUserDictionaries();
        const uniqueDictionaries = Array.from(
          new Map(data.map((item) => [item.id, item])).values()
        );
        setDictionaries(uniqueDictionaries);
      } catch (err) {
        console.error("Failed to fetch dictionaries", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDictionaries();
  }, [user]);

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/dictionary/edit/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await DictionaryService.deleteDictionary(id);
      setDictionaries((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to delete dictionary", error);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(dictionaries.map((f) => f.kategori));
    return ["Semua", ...Array.from(unique)];
  }, [dictionaries]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return dictionaries.filter((f) => {
      const matchesQuery =
        f.kanji.includes(q) ||
        f.hiragana.includes(q) ||
        f.katakana.includes(q) ||
        f.romaji.toLowerCase().includes(q) ||
        f.arti.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "Semua" || f.kategori === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, dictionaries, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filtered, currentPage]
  );

  const handleChange = (_: unknown, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="pt-20 flex justify-center items-center flex-col px-4">
      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex justify-between items-center w-full mb-8">
          <h1 className="text-3xl font-bold text-[#64E9EE] drop-shadow-lg">
            Dictionary
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dictionary/new")}
              className="flex items-center bg-[#64E9EE] hover:bg-[#53cbd1] text-white px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <AddIcon className="mr-2 transform translate-y-[-1px]" />
              Tambah
            </button>
            <button
              onClick={() => navigate("/dictionary/setting")}
              className="p-2 rounded-xl hover:bg-[#64E9EE]/20 text-[#64E9EE] transition-all transform hover:scale-110"
            >
              <SettingsIcon fontSize="medium" />
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="w-full bg-gray-800 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search dictionaries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100 placeholder-gray-400 transition-all"
              />
              <SearchIcon className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-6 pr-10 py-3 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100 appearance-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {cat}
                  </option>
                ))}
              </select>
              <FilterListIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-6xl">
        {isLoading ? (
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
            <p className="text-gray-500 text-lg">Data tidak ada ditemukan :(</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((fc) => (
                <DictionaryItem
                  key={fc.id}
                  dictionary={fc}
                  onEdit={handleEdit}
                  onDelete={() => setConfirmDeleteId(fc.id)}
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

      {/* Delete Confirmation Modal */}
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
  );
};

export default Dictionary;
