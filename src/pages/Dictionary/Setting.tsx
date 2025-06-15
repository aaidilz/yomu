import React, { useState, useEffect } from "react";
import DictionaryService from "../../services/DictionaryService";

const Setting = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dictionaryCount, setDictionaryCount] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Dictionary Setting | Yomu";
  }, []);

  // Ambil jumlah dictionaries saat komponen dimuat
  useEffect(() => {
    const fetchDictionaryCount = async () => {
      try {
        const data = await DictionaryService.getUserDictionaries();
        setDictionaryCount(data.length);
      } catch (error) {
        console.error("Error fetching dictionary count:", error);
      }
    };

    fetchDictionaryCount();
  }, []);

  // ✅ Fungsi untuk mengekspor dictionary sebagai JSON (tanpa `id`)
  const exportDictionaryJson = async () => {
    try {
      const data = await DictionaryService.getUserDictionaries();

      // 🔹 Hapus properti "id" sebelum diekspor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const filteredData = data.map(({ id, ...rest }) => rest);

      const json = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dictionaries.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting dictionaries:", error);
      alert("Gagal mengekspor dictionaries.");
    }
  };

  // ✅ Fungsi untuk menangani pemilihan file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  // ✅ Fungsi untuk mengimpor dictionary dari file JSON
  const importDictionaryJson = async () => {
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
        const validDictionaries = jsonData.filter(
          (item) =>
            (item.hiragana || item.kanji || item.katakana) &&
            item.romaji &&
            item.arti
        );

        if (validDictionaries.length === 0) {
          alert("Tidak ada dictionary yang valid dalam file ini.");
          return;
        }

        setUploading(true);
        await DictionaryService.importDictionaries(validDictionaries);
        setUploading(false);

        alert("Dictionaries berhasil diimpor!");
        setSelectedFile(null);
        window.location.reload();
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Terjadi kesalahan saat mengimpor dictionaries.");
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 text-[#97C8EB]">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-[#97C8EB]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Settings
          </h2>

          {/* Dictionary Count */}
          <div className="text-center mb-8">
            <p className="text-lg md:text-xl">
              {dictionaryCount !== null ? (
                <>
                  Total Dictionaries:
                  <span className="text-[#64E9EE] font-bold ml-2">
                    {dictionaryCount}
                  </span>
                </>
              ) : (
                <span className="text-[#97C8EB]/80">Loading...</span>
              )}
            </p>
          </div>

          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Pilih File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={uploading}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-[#97C8EB] file:text-gray-900 hover:file:bg-[#78b2d9] transition-colors"
              />
              <p className="text-sm text-[#97C8EB]/80">
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
                onClick={importDictionaryJson}
                disabled={uploading || !selectedFile}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                  uploading || !selectedFile
                    ? "bg-gray-700/50 text-[#97C8EB] cursor-not-allowed"
                    : "bg-[#97C8EB] text-gray-900 hover:bg-[#78b2d9] hover:shadow-lg"
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
                onClick={exportDictionaryJson}
                className="w-full py-3 px-6 rounded-xl font-medium text-[#97C8EB] border-2 border-[#97C8EB] hover:bg-[#97C8EB]/10 transition-all hover:shadow-lg"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
