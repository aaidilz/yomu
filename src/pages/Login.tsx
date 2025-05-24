import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBack from "@mui/icons-material/ArrowBack";
import AuthService from "../services/AuthService";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan error
  const [loading, setLoading] = useState(false); // State untuk loading status
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Yomu";
  }, []);

  useEffect(() => {
  if (errorMessage) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
      background: '#0f172a',
      color: '#fff',
    });
  }
}, [errorMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Set loading state

    try {
      await AuthService.signInWithEmail(email, password);
      navigate("/home");
    } catch (error) {
      setErrorMessage("Email atau password salah");
    } finally {
      setLoading(false); // Matikan loading setelah request selesai
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      await AuthService.signInWithGoogle();
      navigate("/home");
    } catch (error) {
      setErrorMessage("Gagal login dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#1A202C]"></div>

      {/* Card Container */}
      <div className="relative bg-[#0f172a] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <div className="flex justify-center">
          <button
            className="w-75 mt-4 py-2 flex items-center justify-center rounded-lg hover:bg-gray-100 transition disabled:opacity-50 text-blue-500"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon className="mr-2" />
            {loading ? "Logging in with Google..." : "Continue with Google"}
          </button>
        </div>
        {/* back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center mt-4 text-white"
        >
          <ArrowBack className="text-white" style={{ fontSize: 30 }} /> Kembali
        </button>
      </div>
    </div>
  );
}
