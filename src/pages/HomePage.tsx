import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { History } from "@mui/icons-material";
import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.3, duration: 0.8 },
  },
};

const textVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const imageVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

export default function HomePage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Navbar */}
      <HomeNavbar />

      {/* Main Content */}
      <div
        className="min-h-screen flex flex-col bg-gradient-to-r from-[#001011] to-[#334155]"
        style={{
          backgroundImage:
            "url('/bg1.jpg'), linear-gradient(to right, #001011, #334155)",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Header */}
        {/* Konten Utama */}
        <div className="flex-grow flex items-center py-16">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Image */}
            <motion.img
              variants={imageVariants}
              src="shiroko.jpg"
              alt="Learn Japanese"
              className="w-52 h-52 md:w-96 md:h-96 rounded mx-auto"
            />

            {/* Right Column - Text */}
            <motion.div
              variants={textVariants}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl font-bold text-[#97C8EB] mb-4">
                Belajar Bahasa Jepang Menjadi Menyenangkan!
              </h1>
              <p className="text-lg text-white leading-relaxed mb-6">
                Mulai perjalanan belajar bahasa Jepangmu hari ini. Pelajari
                kanji, tata bahasa, dan percakapan sehari-hari dengan metode
                interaktif yang menyenangkan!
              </p>

              {/* Tombol Mulai Belajar & Changelog */}
              <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href="/home"
                    className="px-8 py-4 text-lg rounded-full text-[#13AAFB9]"
                  >
                    Mulai Belajar Sekarang
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<History />}
                    href="/changelog"
                    className="px-8 py-4 text-lg rounded-full border-2 text-[#64E9EE]"
                  >
                    Changelog
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <HomeFooter />
      </div>
    </motion.div>
  );
}
