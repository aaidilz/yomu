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
import Swal from "sweetalert2";

import DictionaryItem from "./components/DictionaryItem";
import { useTheme } from "../../contexts/ThemeContext";

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
  const [, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";

  useEffect(() => {
    document.title = "Dictionary | Yomu";
  }, []);

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

  const onDeleteConfirm = useCallback(async (id: string) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      background: isLightMode ? "#ffffff" : "#0f172a",
      color: isLightMode ? "#1e293b" : "#fff",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await DictionaryService.deleteDictionary(id);
        setDictionaries((prev) => prev.filter((f) => f.id !== id));
        await Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          icon: "success",
          background: isLightMode ? "#ffffff" : "#0f172a",
          color: isLightMode ? "#1e293b" : "#fff",
        });
      } catch (err) {
        console.error("Gagal hapus data", err);
        await Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus.",
          icon: "error",
          background: isLightMode ? "#ffffff" : "#0f172a",
          color: isLightMode ? "#1e293b" : "#fff",
        });
      }
      setDeletingId(null);
    }
  }, [isLightMode]);

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

  if (loading) return <p className={`text-center py-4 ${isLightMode ? 'text-gray-600' : 'text-[#97C8EB]'}`}>Loading...</p>;

  return (
    <div className={`pt-20 flex justify-center items-center flex-col px-4 ${isLightMode ? 'text-gray-800 bg-gray-50' : 'text-[#97C8EB] bg-gray-900  '}`}> 
      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8">
        <div className="flex justify-between items-center w-full mb-8">
          <h1 className={`text-3xl font-bold drop-shadow-lg ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}>
            Dictionary
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dictionary/new")}
              className={`flex items-center px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                isLightMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-[#64E9EE] hover:bg-[#53cbd1] text-black'
              }`}
            >
              <AddIcon className="mr-2 transform translate-y-[-1px]" />
              Tambah
            </button>
            <button
              onClick={() => navigate("/dictionary/setting")}
              className={`p-2 rounded-xl transition-all transform hover:scale-110 ${
                isLightMode 
                  ? 'hover:bg-blue-100 text-blue-600' 
                  : 'hover:bg-[#64E9EE]/20 text-[#64E9EE]'
              }`}
            >
              <SettingsIcon fontSize="medium" />
            </button>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className={`w-full backdrop-blur-sm p-4 rounded-2xl shadow-xl ${isLightMode ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}>
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
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${
                  isLightMode
                    ? 'border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-50 text-gray-900 placeholder-gray-500'
                    : 'border-gray-700 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100 placeholder-gray-400'
                }`}
              />
              <SearchIcon className={`h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-6 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 appearance-none transition-all ${
                  isLightMode
                    ? 'border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-50 text-gray-900'
                    : 'border-gray-700 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-900/50 text-gray-100'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className={isLightMode ? "bg-white" : "bg-gray-800"}>
                    {cat}
                  </option>
                ))}
              </select>
              <FilterListIcon className={`h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`} />
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
                className={`h-48 rounded-xl animate-pulse ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`}
              ></div>
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className={`text-lg ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>Data tidak ada ditemukan :(</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((fc) => (
                <DictionaryItem
                  key={fc.id}
                  dictionary={fc}
                  onEdit={handleEdit}
                  onDelete={onDeleteConfirm}
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
                      color: isLightMode ? "#2563eb" : "#64E9EE",
                      borderColor: isLightMode ? "#2563eb" : "#64E9EE",
                    },
                  }}
                />
              </Stack>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
