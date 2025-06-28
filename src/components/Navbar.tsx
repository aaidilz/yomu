import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../configs/firebase-config";
import AuthService from "../services/AuthService";
import { Logout, Settings } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbars() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";

  return (
    <nav className={`${isLightMode ? 'bg-white text-gray-800 border-b border-gray-200' : 'bg-[#001011] text-[#FFFFFF]'} shadow-lg fixed inset-x-0 top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand and main nav */}
          <div className="flex items-center">
            <Link
              to="/home"
              className={`${isLightMode ? 'text-blue-600 hover:text-blue-800' : 'text-[#64E9EE] hover:text-[#13AAFB]'} text-xl font-bold`}
            >
              YOMU
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-6 space-x-4">
              <Link
                to="/note"
                className={`px-3 py-2 rounded-md ${isLightMode ? 'hover:bg-gray-100 hover:text-blue-600' : 'hover:bg-[#093A3E] hover:text-[#64E9EE]'}`}
              >
                Note
              </Link>

              <Link
                to="/dictionary"
                className={`px-3 py-2 rounded-md ${isLightMode ? 'hover:bg-gray-100 hover:text-blue-600' : 'hover:bg-[#093A3E] hover:text-[#64E9EE]'}`}
              >
                Dictionary
              </Link>

              <Menu as="div" className="relative">
                <MenuButton className={`px-3 py-2 rounded-md ${isLightMode ? 'hover:bg-gray-100 hover:text-blue-600' : 'hover:bg-[#093A3E] hover:text-[#64E9EE]'}`}>
                  Games <ExpandMoreIcon />
                </MenuButton>
                <MenuItems
                  transition
                  className={`absolute left-0 mt-2 w-48 ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#093A3E]'} rounded-md shadow-lg py-1 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/games-flashcard"
                        className={`block px-4 py-2 ${active ? (isLightMode ? 'bg-gray-100 text-blue-600' : 'bg-[#001011] text-[#64E9EE]') : ''
                          }`}
                      >
                        FlashCard Flip
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/games-quiz"
                        className={`block px-4 py-2 ${active ? (isLightMode ? 'bg-gray-100 text-blue-600' : 'bg-[#001011] text-[#64E9EE]') : ''
                          }`}
                      >
                        Quiz
                      </Link>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>

          {/* Right side - Feedback + Profile dropdown */}
          <div className="flex items-center">
            <Link
              to="/feedback"
              className={`hidden md:inline-block px-3 py-2 rounded-md mr-4 ${isLightMode ? 'text-blue-500 hover:text-blue-700 hover:bg-gray-100' : 'text-[#97C8EB] hover:text-[#64E9EE] hover:bg-[#093A3E]'}`}
            >
              Feedback
            </Link>

            <Menu
              as="div"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
            >
              <MenuButton className="flex items-center space-x-2 group">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className={`w-8 h-8 rounded-full border-2 border-transparent ${isLightMode ? 'group-hover:border-blue-600' : 'group-hover:border-[#64E9EE]'}`}
                  />
                )}
                <span className={`${isLightMode ? 'text-blue-500 group-hover:text-blue-700' : 'text-[#97C8EB] group-hover:text-[#64E9EE]'}`}>
                  {user?.displayName || user?.email}
                </span>
              </MenuButton>
              <MenuItems
                transition
                className={`absolute right-0 mt-2 w-48 ${isLightMode ? 'bg-white border border-gray-200' : 'bg-[#093A3E]'} rounded-md shadow-lg py-1 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
              >
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/user-setting"
                        className={`flex items-center px-4 py-2 ${active ? (isLightMode ? 'bg-gray-100 text-blue-600' : 'bg-[#001011] text-[#64E9EE]') : ''
                          }`}
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <div className={`border-t ${isLightMode ? 'border-gray-200' : 'border-[#001011]'} my-1`} />
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Yakin ingin keluar?",
                            text: "Kamu akan keluar dari akun ini.",
                            icon: "warning",
                            showCancelButton: true,
                            background: isLightMode ? "#ffffff" : "#0f172a",
                            color: isLightMode ? "#1e293b" : "#fff",
                            confirmButtonText: "Ya, Keluar",
                            cancelButtonText: "Batal",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              AuthService.logout();
                            }
                          });
                        }}
                        className={`flex items-center px-4 py-2 w-full text-left ${active ? (isLightMode ? 'bg-gray-100 text-blue-600' : 'bg-[#001011] text-[#64E9EE]') : ''
                          }`}
                      >
                        <Logout className="w-5 h-5 mr-2" />
                        Log Out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
            </Menu>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-[#093A3E]'}`}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/note" className={`block px-4 py-2 ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-[#093A3E]'}`}>
              Note
            </Link>
            <Link
              to="/dictionary"
              className={`block px-4 py-2 ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-[#093A3E]'}`}
            >
              Dictionary
            </Link>
            <div className="space-y-1">
              <span className={`block px-4 py-2 font-semibold ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}>
                Games
              </span>
              <Link
                to="/games-flashcard"
                className={`block px-4 py-2 ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-[#093A3E]'}`}
              >
                FlashCard
              </Link>
              <Link
                to="/games-quiz"
                className={`block px-4 py-2 ${isLightMode ? 'hover:bg-gray-100' : 'hover:bg-[#093A3E]'}`}
              >
                Quiz
              </Link>
            </div>
            <Link
              to="/feedback"
              className={`block px-4 py-2 ${isLightMode ? 'text-blue-500 hover:text-blue-700 hover:bg-gray-100' : 'text-[#97C8EB] hover:text-[#64E9EE] hover:bg-[#093A3E]'}`}
            >
              Feedback
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
