import { useMemo } from "react";
import AnimatedBubbles from "../components/AnimatedBubbles";
import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import { Language, MenuBook, Update, Code, Casino, EmojiObjects, GroupAdd } from "@mui/icons-material";


export default function About() {
  const bubbles = useMemo(() => <AnimatedBubbles count={50} />, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <section className="min-h-screen flex-grow flex items-center justify-center flex-col text-center bg-gradient-to-b from-[#0F172A] to-[#1E293B] relative overflow-hidden px-4">
        {bubbles}
        <div className="relative z-10 max-w-4xl w-full space-y-8 mt-20 mb-8">
          <div className="space-y-6">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
                Tentang Yomu
              </h1>
              <p className="text-lg text-gray-300 font-medium">
                Belajar Bahasa Jepang dengan Cara yang Menyenangkan
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center bg-gray-800/80 p-6 rounded-xl shadow-lg">
                <Language className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="text-xl font-semibold text-white mb-1">Multi-Metode Belajar</h3>
                <p className="text-gray-300 text-center">
                  Flashcard interaktif, kuis gamifikasi, dan alat konversi romaji
                </p>
              </div>
              <div className="flex flex-col items-center bg-gray-800/80 p-6 rounded-xl shadow-lg">
                <MenuBook className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="text-xl font-semibold text-white mb-1">Komunitas Pembelajar</h3>
                <p className="text-gray-300 text-center">
                  Berbagi materi dan belajar dari konten pengguna lain
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-lg space-y-6">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-lg text-left">
                Yomu dirancang untuk membuat pembelajaran bahasa Jepang menjadi pengalaman yang imersif dan menyenangkan. Dengan kombinasi teknologi modern dan metodologi pembelajaran kolaboratif, kami menghadirkan platform yang terus berkembang bersama kontribusi pengguna.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <HighlightBadge icon={<Update className="text-amber-400" />} text="Pembaruan Rutin" />
                <HighlightBadge icon={<Code className="text-emerald-400" />} text="Open Source" />
                <HighlightBadge icon={<Casino className="text-rose-400" />} text="Gamifikasi" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700/50">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="/feedback"
                className="button-primary text-white"
              >
                <EmojiObjects className="w-5 h-5" />
                Berikan Saran
              </a>
              <a
                href="https://github.com/aaidilz/yomu"
                className="button-secondary text-white"
              >
                <GroupAdd className="w-5 h-5" />
                Kontribusi Aplikasi
              </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 italic mt-4 animate-pulse">
            Versi 1.0 - Terus Berkembang!
          </p>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}

// FeatureCard and HighlightBadge components remain the same as previous version

type HighlightProps = {
  icon: React.ReactNode;
  text: string;
};

function HighlightBadge({ icon, text }: HighlightProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-700/80 px-3 py-1 rounded-full border border-gray-500">
      {icon}
      <span className="text-gray-200 font-medium">{text}</span>
    </div>
  );
}