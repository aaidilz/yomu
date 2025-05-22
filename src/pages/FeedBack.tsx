import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FeedBackService from "../services/FeedBackService";
import Swal from "sweetalert2";

interface Feedback {
  id?: string;
  name: string;
  email: string;
  feedback: string;
}

export default function FeedBack() {
  const [anonymous, setAnonymous] = useState(false);

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
        });
      });
  };

  return (
    <section>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Navbar */}
        <HomeNavbar />

        {/* Content Card */}
        <div className="pt-20 pb-8 px-6 md:px-10 flex-grow">
          <div className="mx-auto max-w-4xl space-y-8">
            <h1 className="text-3xl font-bold text-[#13AAFB] md:text-4xl">
              Feedback
            </h1>
            <p className="text-lg text-gray-300">
              Kami sangat menghargai masukan Anda! Mulai dari saran tampilan UI,
              ide baru, atau perbaikan fitur yang sudah ada, semuanya membantu
              Dev memperbaiki kualitas aplikasi ini. Silakan isi formulir di
              bawah ini untuk memberikan umpan balik Anda.
            </p>
          </div>

          {/* form */}
          <div className="mx-auto max-w-4xl space-y-8 mt-8">
            <form
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="mb-4 flex items-center">
                <Switch
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  color="primary"
                />
                <label className="ml-2 text-gray-300">
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
                    <label className="block text-gray-300 mb-2" htmlFor="name">
                      Nama
                    </label>
                    <input
                      className="w-full p-2 bg-gray-700 text-white rounded"
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Masukkan nama Anda"
                    />
                    <div className="mb-4">
                      <label
                        className="block text-gray-300 mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="w-full p-2 bg-gray-700 text-white rounded"
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
                <label className="block text-gray-300 mb-2" htmlFor="feedback">
                  Umpan Balik
                </label>
                <textarea
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  id="feedback"
                  name="feedback"
                  required
                  rows={4}
                  placeholder="Tulis umpan balik Anda di sini"
                ></textarea>
              </div>
              <button
                className="bg-[#13AAFB] text-white px-4 py-2 rounded hover:bg-[#0f8dc9]"
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
