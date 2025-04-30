import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { AccountCircle, History } from "@mui/icons-material";

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

      {/* Main Content */}
      <div className="min-h-screen flex items-center bg-gradient-to-r from-[#001011]  to-[#334155]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Image */}

          <motion.img
            variants={imageVariants}
            src="shiroko.jpg" // Ganti dengan path gambar Anda
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
              Mulai perjalanan belajar bahasa Jepangmu hari ini. Pelajari kanji,
              tata bahasa, dan percakapan sehari-hari dengan metode interaktif
              yang menyenangkan!
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
    </motion.div>
  );
}
