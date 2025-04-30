import ReactMarkdown from "react-markdown";
import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";

const ChangeLog = () => {
  const cardData = {
    header: "Release Notes",
    version: "1.0.0",
    date: "30 April 2025",
    tag: "Stable",
    description:
      "- Feature: **Perbaikan tampilan** pada halaman Note Editor. 🎨\n- Feature: **Implementasi konversi** romaji ke hiragana dan katakana secara otomatis. 🔤\n- Feature: **Implementasi fitur Quiz** untuk latihan interaktif. 🧠\n- UI: **Penyesuaian warna** di pengaturan flashcard. 🎨\n- UX: **Penambahan layout loading** di halaman Note. ⏳",
    status: "Feature",
  };

  return (
    <div className="min-h-screen bg-[#1A202C]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-sm z-50 px-4 md:px-8 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <a href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#13AAFB] to-blue-400 bg-clip-text text-transparent">
              TPoser
            </span>
          </a>

          <div className="flex items-center space-x-4">
            <Button
              href="/login"
              variant="outlined"
              className="!normal-case !text-white !border-gray-400 hover:!border-[#13AAFB] hover:!bg-[#13AAFB]/10 !transition-all !duration-300 !rounded-lg !px-4 !py-2"
              startIcon={<AccountCircle className="!text-white" />}
            >
              <span className="text-sm font-medium">Login</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content Card */}
      <div className="pt-24 pb-12 px-6 md:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-[#13AAFB] md:text-4xl">
            {cardData.header}
          </h1>

          <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-[#13AAFB]">
                  Versi: {cardData.version}
                </span>
                <span className="text-sm text-gray-500">{cardData.date}</span>
              </div>
              {cardData.tag && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {cardData.tag}
                </span>
              )}
            </div>

            <div className="prose pt-4 text-white">
              <ReactMarkdown>{cardData.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeLog;
