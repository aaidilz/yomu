import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../configs/firebase-config";
import AuthService from "../services/AuthService";

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
                to="/flashcard"
                className="px-3 py-2 rounded-md hover:bg-[#093A3E] hover:text-[#64E9EE]"
              >
                Flashcard
              </Link>

              <Menu as="div" className="relative">
                <MenuButton className="px-3 py-2 rounded-md hover:bg-[#093A3E] hover:text-[#64E9EE]">
                  Games <ArrowDropDownIcon />
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
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
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
                        <svg
                          className="w-5 h-5 mr-2 inline-block"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/note" className="block px-4 py-2 hover:bg-[#093A3E]">
              Note
            </Link>
            <Link
              to="/flashcard"
              className="block px-4 py-2 hover:bg-[#093A3E]"
            >
              Configure - FlashCard
            </Link>
            <Link
              to="/games-flashcard"
              className="block px-4 py-2 hover:bg-[#093A3E]"
            >
              Games - FlashCard
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
