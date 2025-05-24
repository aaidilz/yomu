import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import { useMemo } from "react";
import AnimatedBubbles from "../components/AnimatedBubbles";

export default function HomePage() {
    const bubbles = useMemo(() => <AnimatedBubbles count={50} />, []);


  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <section className="min-h-screen flex-grow flex items-center justify-center flex-col text-center bg-gradient-to-b from-[#0F172A] to-[#1E293B] relative overflow-hidden">
        {/* Bubble Container */}
        <div className="absolute inset-0 z-0">
          {bubbles}
        </div>

        {/* Content */}
        <div className="text-center max-w-2xl px-4 relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            YOMU
          </h1>
          <p className="text-base text-gray-400">
            Buat cara belajar bahasa Jepangmu hari ini. Pelajari kanji,
            tata bahasa, dan percakapan sehari-hari dengan metode interaktif
            yang menyenangkan!
          </p>
        </div>
        <div className="flex justify-center mt-8 relative z-10">
          <a
            href="/home"
            className="bg-[#13AAFB] text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-[#0f8dbf] transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="ml-4 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            About
          </a>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}