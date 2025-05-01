import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function HomeNavbar() {
  return (
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
  );
}
