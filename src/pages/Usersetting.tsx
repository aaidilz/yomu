import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import AuthService from "../services/AuthService";
import { Logout } from "@mui/icons-material";
import DictionaryService from "../services/DictionaryService";
import NoteService from "../services/NoteService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Usersetting() {
  const [user] = useAuthState(auth);
  const [, setUserData] = useState<unknown>(null);

  const deleteAllDictionaries = async () => {
    try {
      await DictionaryService.deleteAllDictionaries();
      alert("Berhasil menghapus semua dictionaries.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting all dictionaries:", error);
      alert("Gagal menghapus semua dictionaries.");
    }
  };

  const deleteAllNotes = async () => {
    try {
      await NoteService.deleteAllNotes();
      alert("Berhasil menghapus semua notes.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting all notes:", error);
      alert("Gagal menghapus semua notes.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AuthService.getCurrentUserData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 text-white mt-8">
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-10">
        {/* Kiri: Foto dan Nama */}
        <div className="md:w-1/3 flex flex-col items-center text-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#97C8EB]"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 mb-4 border-4 border-[#97C8EB]" />
          )}
          <h2 className="text-2xl font-semibold text-[#97C8EB]">
            {user?.displayName || "Unknown User"}
          </h2>
          <p className="text-gray-400">{user?.email || "No email"}</p>

          <p className="text-xs text-gray-500 mt-2 break-all">
            UID: {user?.uid || "No UID"}
          </p>
        </div>

        {/* Kanan: Dua container */}
        <div className="md:w-2/3 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2 text-[#97C8EB]">
              Preferences
            </h3>
            <p className="text-gray-400">
              Manage your preferences, theme, and notifications.
            </p>
            {/* coming soon :) */}
            <div className="mt-4">
              <p className="text-gray-500">Fungsi ini bakal Coming soon :)</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-red-700 bg-red-900/30">
            <h3 className="text-xl font-semibold mb-2 text-red-400 flex items-center gap-2">
              Danger Zone
            </h3>
            <p className="text-gray-400 mb-4">
              Perform critical actions such as data deletion and account
              sign-out.
            </p>

            {/* Hapus data */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Yakin ingin menghapus semua dictionaries?",
                    text: "Aksi ini tidak dapat dibatalkan kalau sudah dilakukan.",
                    icon: "warning",
                    showCancelButton: true,
                    background: "#0f172a",
                    color: "#fff",
                    confirmButtonText: "Ya, Hapus Semua",
                    cancelButtonText: "Batal",
                  });
                  if (result.isConfirmed) {
                    deleteAllDictionaries();
                  }
                }}
              >
                Delete All Dictionaries
              </button>

              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Yakin ingin menghapus semua catatan?",
                    text: "Aksi ini tidak dapat dibatalkan kalau sudah dilakukan.",
                    icon: "warning",
                    showCancelButton: true,
                    background: "#0f172a",
                    color: "#fff",
                    confirmButtonText: "Ya, Hapus Semua",
                    cancelButtonText: "Batal",
                  });
                  if (result.isConfirmed) {
                    deleteAllNotes();
                  }
                }}
              >
                Delete All Notes
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-red-700 pt-4">
              <p className="text-sm text-red-300 mb-2">Account Management</p>
              <button
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Yakin ingin keluar?",
                    text: "Kamu akan keluar dari akun ini.",
                    icon: "warning",
                    showCancelButton: true,
                    background: "#0f172a",
                    color: "#fff",
                    confirmButtonText: "Ya, Keluar",
                    cancelButtonText: "Batal",
                  });
                  if (result.isConfirmed) {
                    await AuthService.logout();
                  }
                }}
              >
                <Logout fontSize="small" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
