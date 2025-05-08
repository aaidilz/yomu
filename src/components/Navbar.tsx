import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../configs/firebase-config";
import AuthService from "../services/AuthService";
import { Logout, Settings } from "@mui/icons-material";

export default function Navbars() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#001011] text-[#FFFFFF] shadow-lg fixed inset-x-0 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand and main nav */}
          <div className="flex items-center">
            <Link
              to="/home"
              className="text-[#64E9EE] hover:text-[#13AAFB] text-xl font-bold"
            >
              Home
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-6 space-x-4">
              <Link
                to="/note"
                className="px-3 py-2 rounded-md hover:bg-[#093A3E] hover:text-[#64E9EE]"
              >
                Note
              </Link>

              <Link
                to="/dictionary"
                className="px-3 py-2 rounded-md hover:bg-[#093A3E] hover:text-[#64E9EE]"
              >
                Dictionary
              </Link>

              <Menu as="div" className="relative">
                <MenuButton className="px-3 py-2 rounded-md hover:bg-[#093A3E] hover:text-[#64E9EE]">
                  Games <ExpandMoreIcon />
                </MenuButton>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-1"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-1"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <MenuItems className="absolute left-0 mt-2 w-48 bg-[#093A3E] rounded-md shadow-lg py-1">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/games-flashcard"
                          className={`block px-4 py-2 ${
                            active ? "bg-[#001011] text-[#64E9EE]" : ""
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
                          className={`block px-4 py-2 ${
                            active ? "bg-[#001011] text-[#64E9EE]" : ""
                          }`}
                        >
                          Quiz
                        </Link>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Right side - Profile dropdown */}
          <div className="flex items-center">
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center space-x-2 group">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-[#64E9EE]"
                  />
                )}
                <span className="text-[#97C8EB] group-hover:text-[#64E9EE]">
                  {user?.displayName || user?.email}
                </span>
              </MenuButton>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-1"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-1"
                leaveTo="transform scale-95 opacity-0"
              >
                <MenuItems className="absolute right-0 mt-2 w-48 bg-[#093A3E] rounded-md shadow-lg py-1">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`flex items-center px-4 py-2 ${
                          active ? "bg-[#001011] text-[#64E9EE]" : ""
                        }`}
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <div className="border-t border-[#001011] my-1" />
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => AuthService.logout()}
                        className={`w-full text-left px-4 py-2 ${
                          active ? "bg-[#001011] text-[#64E9EE]" : ""
                        }`}
                      >
                        <Logout className="w-5 h-5 mr-2" />
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-[#093A3E] rounded-lg"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/note" className="block px-4 py-2 hover:bg-[#093A3E]">
              Note
            </Link>
            <Link
              to="/dictionary"
              className="block px-4 py-2 hover:bg-[#093A3E]"
            >
              Dictionary
            </Link>
            <div className="space-y-1">
              <span className="block px-4 py-2 font-semibold text-[#64E9EE]">
                Games
              </span>
              <Link
                to="/games-flashcard"
                className="block px-4 py-2 hover:bg-[#093A3E]"
              >
                FlashCard
              </Link>
              <Link
                to="/games-quiz"
                className="block px-4 py-2 hover:bg-[#093A3E]"
              >
                Quiz
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
