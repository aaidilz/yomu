import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBack from "@mui/icons-material/ArrowBack";
import AuthService from "../services/AuthService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading status
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Set loading state

    try {
      await AuthService.signInWithEmail(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in", error);
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
      console.error("Error with Google login", error);
      setErrorMessage("Gagal login dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]  to-[#334155]"></div>

      {/* Card Container */}
      <div className="relative bg-gradient-to-r from-[#0f172a]  to-[#334155] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Login
        </h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
            {errorMessage}
          </div>
        )}

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
