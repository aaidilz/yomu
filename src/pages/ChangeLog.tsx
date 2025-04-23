import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { AccountCircle } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent p-4 flex justify-between items-center z-10">
      <a href="/" className="text-lg font-bold text-white">
        TPoser
      </a>
      <Button
        href="/login"
        startIcon={<AccountCircle className="text-white" />}
      >
        Login
      </Button>
    </nav>
  );
};

const changelogData: {
  version: string;
  date: string;
  description: string;
  status?: string;
  current?: boolean;
}[] = [
  {
    version: "1.4.1",
    date: "2025-04-21",
    description:
      "- Feature: **Perbaikan tampilan** pada halaman Note Editor. 🎨\n" +
      "- Feature: **Implementasi konversi** romaji ke hiragana dan katakana secara otomatis. 🔤\n" +
      "- UI: **Penyesuaian warna** di pengaturan flashcard. 🎨\n" +
      "- UX: **Penambahan layout loading** di halaman Note. ⏳",
    status: "Feature",
    current: true,
  },
  {
    version: "1.4.0",
    date: "2025-04-10",
    description:
      "- 🚀 Performa aplikasi **dioptimalkan** :) \n- 🎨 **Adjustment** tampilan Flashcard dan Note \n- 🛠️ Fix **bug path navigasi pada Note Editor** \n- ✅ **penyesuaian kecil pada validasi**",
    status: "Feature",
  },
  {
    version: "1.3.2",
    date: "2025-03-21",
    description:
      " **Bugfix:** Layar tidak bisa scroll saat **fullscreen editor Note** ketika menekan tombol *back browser*. 🐞\n\n_***Update**: Logika input data di Changelog_.",
    status: "bugfix",
  },
  {
    version: "1.3.1",
    date: "2025-03-20",
    description:
      "**Penambahan**: fitur Search dan Sorting untuk kemudahan navigasi! 📌\n\n ****Minor adjustment***: untuk tampilan Flashcards ",
    status: "feature",
  },
  {
    version: "1.3.0",
    date: "2025-03-20",
    description: "✨ Tampilan baru Markdown untuk fitur Note! 📝",
    status: "feature",
  },
  {
    version: "1.2.2",
    date: "2025-03-17",
    description:
      "🚧 Halaman 404 kini hadir! Tidak perlu bingung lagi saat halaman tidak ditemukan. 🔍",
    status: "adjust",
  },
  {
    version: "1.2.1",
    date: "2025-03-16",
    description: "🎨 UI sedikit diperhalus agar lebih nyaman dipandang! 😉",
    status: "adjust",
  },
  {
    version: "1.2.0",
    date: "2025-03-14",
    description:
      "🚀 UI kini lebih modern! beralih dari Bootstrap ke TailwindCSS. 🎉",
    status: "feature",
  },
  {
    version: "1.1.0",
    date: "2025-03-14",
    description:
      "📝 Menambah fitur Note! Simpan catatan pentingmu dengan mudah. 📌",
    status: "feature",
  },
  {
    version: "1.0.1",
    date: "2025-03-14",
    description: "🐞 Bug pada form flashcard telah diperbaiki. ✅",
    status: "bugfix",
  },
  {
    version: "1.0.0",
    date: "2025-03-13",
    description: "🎉 Versi pertama telah dirilis! 🚀",
    status: "release",
  },
];

interface BadgeProps {
  label: string;
  variant?: "current" | "default";
}

const Badge = ({ label, variant = "default" }: BadgeProps) => {
  const badgeClass = variant === "current" ? "bg-green-500" : "bg-gray-600";
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass} text-white`}
    >
      {label}
    </motion.span>
  );
};

interface ChangelogItemProps {
  item: {
    version: string;
    date: string;
    description: string;
    status?: string;
    current?: boolean;
  };
}

const ChangelogItem = ({ item }: ChangelogItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-lg shadow-lg p-6 transition-transform"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-[#13AAFB]">v{item.version}</h3>
          <p className="text-[#64E9EE] text-sm">{item.date}</p>
        </div>
        <div className="flex space-x-2">
          {item.current && <Badge label="Current" variant="current" />}
          {item.status && <Badge label={item.status} />}
        </div>
      </div>
      <div className="text-white text-lg" style={{ whiteSpace: "pre-wrap" }}>
        <ReactMarkdown>{item.description}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default function Changelog() {
  // Kelompokkan data berdasarkan major.minor
  const groupedChangelog = changelogData.reduce((acc, item) => {
    const groupKey = item.version.split(".").slice(0, 2).join(".");
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, typeof changelogData>);

  // Urutkan grup secara descending
  const sortedGroups = Object.keys(groupedChangelog).sort((a, b) => {
    const [aMajor, aMinor] = a.split(".").map(Number);
    const [bMajor, bMinor] = b.split(".").map(Number);
    if (aMajor !== bMajor) return bMajor - aMajor;
    return bMinor - aMinor;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#001011] to-[#334155]">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4 pt-24 pb-12"
      >
        {sortedGroups.map((group) => (
          <div key={group} className="mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-[#13AAFB] mb-4 border-b border-gray-700 pb-2"
            >
              v{group}
            </motion.h2>
            <div className="relative ml-8">
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {groupedChangelog[group].map((item, index) => (
                  <div key={index} className="relative">
                    {/* Titik timeline */}
                    <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#ffffff] rounded-full"></div>
                    <ChangelogItem item={item} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        ))}
      </motion.main>
    </div>
  );
}
