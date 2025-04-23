import React, { useState, useEffect } from "react";
import FlashcardService from "../../services/FlashcardService";

const Setting = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [flashcardCount, setFlashcardCount] = useState<number | null>(null);

  // Ambil jumlah flashcards saat komponen dimuat
  useEffect(() => {
    const fetchFlashcardCount = async () => {
      try {
        const data = await FlashcardService.getUserFlashcards();
        setFlashcardCount(data.length);
      } catch (error) {
        console.error("Error fetching flashcard count:", error);
      }
    };

    fetchFlashcardCount();
  }, []);

  // ✅ Fungsi untuk mengekspor flashcard sebagai JSON (tanpa `id`)
  const exportFlashcardJson = async () => {
    try {
      const data = await FlashcardService.getUserFlashcards();

      // 🔹 Hapus properti "id" sebelum diekspor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const filteredData = data.map(({ id, ...rest }) => rest);

      const json = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "flashcards.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting flashcards:", error);
      alert("Gagal mengekspor flashcards.");
    }
  };

  // ✅ Fungsi untuk menangani pemilihan file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  // ✅ Fungsi untuk mengimpor flashcard dari file JSON
  const importFlashcardJson = async () => {
    if (!selectedFile) {
      alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        if (!Array.isArray(jsonData)) {
          alert("File JSON tidak valid. Pastikan formatnya benar.");
          return;
        }

        // 🔹 Filter hanya data yang memiliki setidaknya 1 karakter
        const validFlashcards = jsonData.filter(
          (item) =>
            (item.hiragana || item.kanji || item.katakana) &&
            item.romaji &&
            item.arti
        );

        if (validFlashcards.length === 0) {
          alert("Tidak ada flashcard yang valid dalam file ini.");
          return;
        }

        setUploading(true);
        await FlashcardService.importFlashcards(validFlashcards);
        setUploading(false);

        alert("Flashcards berhasil diimpor!");
        setSelectedFile(null);
        window.location.reload();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Terjadi kesalahan saat mengimpor flashcards.");
      }
    };

    reader.readAsText(selectedFile);
  };

  const deleteAllFlashcards = async () => {
    try {
      await FlashcardService.deleteAllFlashcards();
      alert("Berhasil menghapus semua flashcards.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting all flashcards:", error);
      alert("Gagal menghapus semua flashcards.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-[#64E9EE]/20">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#64E9EE]">
            Settings
          </h2>

          {/* Flashcard Count */}
          <div className="text-center mb-8">
            <p className="text-[#97C8EB] text-lg">
              {flashcardCount !== null ? (
                <>
                  Total Flashcards:
                  <span className="text-[#64E9EE] font-bold ml-2">
                    {flashcardCount}
                  </span>
                </>
              ) : (
                <span className="text-[#97C8EB]">Loading...</span>
              )}
            </p>
          </div>

          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="block text-[#97C8EB] text-sm font-medium mb-2">
                Pilih File
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="block w-full text-sm text-[#97C8EB] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#13AAFB] file:text-white hover:file:bg-[#0F8AC4] transition-colors"
                />
              </div>

              <p className="text-[#97C8EB]/80 text-sm">
                Supported formats: .json
              </p>

              {selectedFile && (
                <p className="text-[#64E9EE] text-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  File terpilih: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={importFlashcardJson}
                disabled={uploading || !selectedFile}
                className={`w-full py-3 px-6 rounded-xl font-mediu transition-all ${
                  uploading || !selectedFile
                    ? "bg-gray-700/75 cursor-not-allowed text-[#64E9EE]"
                    : "bg-[#64E9EE] hover:bg-[#0F8AC4] hover:shadow-lg"
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Importing...
                  </div>
                ) : (
                  "Import Data"
                )}
              </button>

              <button
                onClick={exportFlashcardJson}
                className="w-full py-3 px-6 rounded-xl font-medium text-[#64E9EE] border-2 border-[#64E9EE] hover:bg-[#64E9EE]/10 transition-all hover:shadow-lg"
              >
                Export Data
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Apakah Anda yakin ingin menghapus semua flashcards?"
                    )
                  ) {
                    deleteAllFlashcards();
                  }
                }}
                className="w-full py-3 px-6 rounded-xl font-medium bg-[#001011]/80 backdrop-blur-sm border border-[#64E9EE]/20
                        hover:bg-[#093A3E]/90 text-[#ff0000] transition-all hover:shadow-lg"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
