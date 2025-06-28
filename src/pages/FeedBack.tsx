import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FeedBackService from "../services/FeedBackService";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";

interface Feedback {
  id?: string;
  name: string;
  email: string;
  feedback: string;
}

export default function FeedBack() {
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    document.title = "Feedback | Yomu";
  }, []);

  // dump feedback to console
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const feedbackData: Feedback = {
      name: anonymous ? "anonymous" : (formData.get("name") as string),
      email: anonymous
        ? "anonymous@mail.id"
        : (formData.get("email") as string),
      feedback: formData.get("feedback") as string,
    };
    FeedBackService.addFeedback(feedbackData)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Feedback Terkirim",
          text: "Terima kasih atas umpan balik Anda!",
          background: isLightMode ? "#ffffff" : "#0f172a",
          color: isLightMode ? "#1e293b" : "#fff",
        }).then(() => {
          window.history.back();
          (e.target as HTMLFormElement).reset();
        });
      })
      .catch((error: unknown) => {
        console.error("Error submitting feedback:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "Gagal mengirim umpan balik. Silakan coba lagi.",
          background: isLightMode ? "#ffffff" : "#0f172a",
          color: isLightMode ? "#1e293b" : "#fff",
        });
      });
  };

  return (
    <section>
      <div className={`min-h-screen flex flex-col ${isLightMode ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'}`}>
        {/* Navbar */}
        <HomeNavbar />

        {/* Content Card */}
        <div className="pt-20 pb-8 px-6 md:px-10 flex-grow">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className={`text-3xl font-bold md:text-4xl ${isLightMode ? 'text-blue-600' : 'text-[#13AAFB]'}`}>
              Feedback
            </h1>
            <p className={`text-lg ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Kami sangat menghargai masukan Anda! Mulai dari saran tampilan UI,
              ide baru, atau perbaikan fitur yang sudah ada, semuanya membantu
              Dev memperbaiki kualitas aplikasi ini. Silakan isi formulir di
              bawah ini untuk memberikan umpan balik Anda.
            </p>
          </div>

          {/* form */}
          <div className="mx-auto max-w-4xl space-y-8 mt-8">
            <form
              className={`p-6 rounded-lg shadow-lg ${isLightMode ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}
              onSubmit={handleSubmit}
            >
              <div className="mb-4 flex items-center">
                <Switch
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  color="primary"
                />
                <label className={`ml-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                  Kirim sebagai anonim
                </label>
              </div>
              <AnimatePresence>
                {!anonymous && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <label className={`block mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="name">
                      Nama
                    </label>
                    <input
                      className={`w-full p-2 rounded ${isLightMode ? 'bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-500' : 'bg-gray-700 text-white placeholder-gray-400'}`}
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Masukkan nama Anda"
                    />
                    <div className="mb-4">
                      <label
                        className={`block mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={`w-full p-2 rounded ${isLightMode ? 'bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-500' : 'bg-gray-700 text-white placeholder-gray-400'}`}
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mb-4">
                <label className={`block mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`} htmlFor="feedback">
                  Umpan Balik
                </label>
                <textarea
                  className={`w-full p-2 rounded ${isLightMode ? 'bg-gray-100 text-gray-800 border border-gray-300 placeholder-gray-500' : 'bg-gray-700 text-white placeholder-gray-400'}`}
                  id="feedback"
                  name="feedback"
                  required
                  rows={4}
                  placeholder="Tulis umpan balik Anda di sini"
                ></textarea>
              </div>
              <button
                className={`px-4 py-2 rounded transition-colors ${isLightMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#13AAFB] text-white hover:bg-[#0f8dc9]'}`}
                type="submit"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <HomeFooter />
      </div>
    </section>
  );
}
