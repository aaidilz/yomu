import { motion } from "framer-motion";
import { useMemo } from "react";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";

// Generate random bubbles with different properties
const generateBubbles = (count = 15) => {
  return Array.from({ length: count }).map((_, index) => {
    const size = Math.floor(Math.random() * 40 + 10); // Random size between 10-50px
    return (
      <motion.div
        key={index}
        className="absolute rounded-full bg-white/10"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{
          y: 100,
          scale: 0.5,
        }}
        animate={{
          y: -100,
          scale: 1.2,
        }}
        transition={{
          duration: Math.random() * 5 + 5, // Random duration between 5-10s
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    );
  });
};

export default function HomePage() {
  // Memoize the bubbles to avoid recalculating them on every render
  const bubbles = useMemo(() => generateBubbles(50), []);

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
          <span className="block text-sm text-gray-300 mb-2">
            #SpiritOfLearning
          </span>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            YOMU
          </h1>
          <p className="text-base text-gray-400">
            Mulai perjalanan belajar bahasa Jepangmu hari ini. Pelajari kanji,
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
            href="/changelog"
            className="ml-4 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            ChangeLog
          </a>
        </div>
      </section>
      <HomeFooter />
    </div>
  );
}