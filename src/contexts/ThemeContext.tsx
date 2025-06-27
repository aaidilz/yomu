import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import UserPreferencesService from "../services/UserPreferenceService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Define dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#97C8EB", // Blue accent color
    },
    secondary: {
      main: "#64748b", // Gray accent
    },
    background: {
      default: "#0f172a", // Dark background
      paper: "#1e293b", // Slightly lighter for cards
    },
    text: {
      primary: "#ffffff",
      secondary: "#9ca3af",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f172a",
          color: "#ffffff",
        },
      },
    },
  },
});

// Define light theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Darker blue for light mode
    },
    secondary: {
      main: "#64748b", // Gray accent
    },
    background: {
      default: "#ffffff", // Light background
      paper: "#f8fafc", // Slightly gray for cards
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
          color: "#1e293b",
        },
      },
    },
  },
});

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [user] = useAuthState(auth);

  // Load user preferences when user is available
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user) {
        try {
          const preferences = await UserPreferencesService.getUserPreferences();
          setThemeModeState(preferences.theme);
          // Update document theme attribute
          if (preferences.theme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        } catch (error) {
          console.error("Failed to load user theme:", error);
          // Default to dark mode if error
          setThemeModeState("dark");
          document.documentElement.removeAttribute("data-theme");
        }
      } else {
        // If no user, use localStorage or default to dark
        const savedTheme = localStorage.getItem("theme") as ThemeMode;
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeModeState(savedTheme);
          if (savedTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        } else {
          setThemeModeState("dark");
          document.documentElement.removeAttribute("data-theme");
        }
      }
    };

    loadUserTheme();
  }, [user]);

  const setThemeMode = async (mode: ThemeMode) => {
    console.log(`Changing theme to: ${mode}`);
    setThemeModeState(mode);
    
    // Update document theme attribute for CSS variables
    if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    
    if (user) {
      try {
        console.log(`Saving theme ${mode} to Firebase for user: ${user.uid}`);
        await UserPreferencesService.updateTheme(mode);
        console.log(`Theme ${mode} successfully saved to Firebase`);
      } catch (error) {
        console.error("Failed to save theme to Firebase:", error);
        throw error; // Re-throw to allow component to handle the error
      }
    } else {
      try {
        // Save to localStorage if no user
        localStorage.setItem("theme", mode);
        console.log(`Theme ${mode} saved to localStorage`);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
        throw error;
      }
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  };

  const currentTheme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
