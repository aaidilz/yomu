import ReactMarkdown from "react-markdown";
import Footers from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import { useEffect } from "react";

const ChangeLog = () => {
  useEffect(() => {
    document.title = "ChangeLog | Yomu";
  }, []);

  const changelogs = [
    {
      version: "1.0.3",
      date: "5 Juni 2025",
      tag: "Current",
      description:
"- feature: **Implementasi AI Chat** untuk interaksi yang lebih baik dengan pengguna. 💬\n- Experimental: **Implementasi AI Dictionary** untuk membantu dalam pengelolaan data kamus."    },
    {
      version: "1.0.2",
      date: "24 Mei 2025",
      tag: "",
      description:
        "- Update: **Tampilan Home diperbarui** dengan desain baru & warna aksen yang disesuaikan. ✨ \n- BugFix: **Celah putih di sisi kanan** saat scrollbar disembunyikan telah diperbaiki. 🐞 \n- Feature: **Implementasi Autofill** pada entry data Dictionary \n- Adjust: **Penyesuaian tampilan** pada bagian penambahan entry data Dictionary. 🎨",
    },
    {
      version: "1.0.1",
      date: "10 Mei 2025",
      tag: "",
      description:
        "- Feature: **Implementasi feedback** untuk data collecting \n- Adjust: **Tampilan** agar lebih responsif dan user-friendly.",
    },
    {
      version: "1.0.0",
      date: "30 April 2025",
      tag: "",
      description:
        "- Feature: **Perbaikan tampilan** pada halaman Note Editor. 🎨\n- Feature: **Implementasi konversi** romaji ke hiragana dan katakana secara otomatis. 🔤\n- Feature: **Implementasi fitur Quiz** untuk latihan interaktif. 🧠\n- UI: **Penyesuaian warna** di pengaturan flashcard. 🎨\n- UX: **Penambahan layout loading** di halaman Note. ⏳",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <HomeNavbar />
      {/* Content Card */}
      <div className="pt-24 pb-12 px-6 md:px-10 flex-grow">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-3xl font-bold text-[#13AAFB] md:text-4xl">
            Release Notes
          </h1>

          {changelogs.map((changelog) => (
            <div
              key={changelog.version}
              className="rounded-lg bg-gray-800 p-6 shadow-lg"
            >
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-[#13AAFB]">
                    Versi: {changelog.version}
                  </span>
                  <span className="text-sm text-gray-500">
                    {changelog.date}
                  </span>
                </div>
                {changelog.tag && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {changelog.tag}
                  </span>
                )}
              </div>

              <div className="prose pt-4 text-white">
                <ReactMarkdown>{changelog.description}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footers />
    </div>
  );
};

export default ChangeLog;
