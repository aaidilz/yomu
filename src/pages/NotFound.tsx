import WarningIcon from "@mui/icons-material/Warning";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function NotFound() {
  const dots = [0, 0.2, 0.4];

  useEffect(() => {
    document.title = "Not Found 404 | Yomu";
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('/404.jpg'), linear-gradient(to right, #001011, #334155)",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ rotate: 15 }} // Mulai dengan rotasi miring
        animate={{ rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <WarningIcon fontSize="large" sx={{ fontSize: 100, color: "white" }} />
      </motion.div>

      <h1 className="text-4xl font-bold text-[#97C8EB] mb-4">404 Not Found</h1>
      <Typography className="text-[#bbbbbb]">
        Halaman yang Anda cari tidak ditemukan
      </Typography>
      <div className="flex space-x-2 mt-4">
        {dots.map((delay, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full border border-[#97C8EB]"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
