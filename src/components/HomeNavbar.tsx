import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";

export default function HomeNavbar() {
  const [user] = useAuthState(auth);
  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-sm z-50 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold bg-gradient-to-r from-[#13AAFB] to-blue-400 bg-clip-text text-transparent">
            YOMU
          </span>
        </a>
        <div className="flex items-center gap-4">
          {user ? (
            <div
              className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 shadow-sm backdrop-blur-sm cursor-pointer"
              onClick={() => {
                window.location.href = "/home";
                
              }}
            >
              <img
                src={user.photoURL ?? ""}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border border-white/30"
              />
              <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                {user.displayName ?? "User"}
              </span>
            </div>
          ) : (
            <Button
              href="/login"
              variant="outlined"
              className="!normal-case !text-white !border-white/30 hover:!border-[#13AAFB] hover:!bg-[#13AAFB]/10 transition-all duration-300 rounded-lg px-4 py-2"
              startIcon={<AccountCircle className="!text-white" />}
            >
              <span className="text-sm font-medium">Login</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
