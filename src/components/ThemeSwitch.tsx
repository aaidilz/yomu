import { Box, Typography, Switch, FormControlLabel, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";
import { toast } from "react-toastify";

// Styled Switch untuk tema dark/light
const ThemeSwitch = styled(Switch)(({ checked }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: checked ? "#97C8EB" : "#aab4be", // Light blue accent for light mode
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: checked ? "#97C8EB" : "#424242", // Dark gray for dark mode
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: checked ? "#97C8EB" : "#525252", // Dark gray for dark mode
    borderRadius: 20 / 2,
  },
}));

export default function ThemeSwitchComponent() {
  const { themeMode, setThemeMode } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const isLightMode = themeMode === "light";

  const handleThemeToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? "light" : "dark";
    setIsSaving(true);
    
    try {
      await setThemeMode(newTheme);
      console.log(`Theme successfully changed to: ${newTheme}`);
      
      // Show success notification
      toast.success(`Theme changed to ${newTheme} mode!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          backgroundColor: newTheme === "light" ? "#ffffff" : "#1e293b",
          color: newTheme === "light" ? "#1e293b" : "#ffffff",
        },
      });
    } catch (error) {
      console.error("Failed to save theme:", error);
      toast.error("Failed to save theme preference", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <DarkMode sx={{ color: isLightMode ? "#6b7280" : "#97C8EB" }} />
      <FormControlLabel
        control={
          <ThemeSwitch
            checked={isLightMode}
            onChange={handleThemeToggle}
            name="themeToggle"
            disabled={isSaving}
          />
        }
        label=""
        sx={{ margin: 0 }}
      />
      <LightMode sx={{ color: isLightMode ? "#97C8EB" : "#6b7280" }} />
      <Typography
        variant="body2"
        sx={{ 
          color: "#9ca3af",
          ml: 1,
          fontWeight: 500
        }}
      >
        {isSaving ? "Saving..." : (isLightMode ? "Light Mode" : "Dark Mode")}
      </Typography>
      {isSaving && (
        <CircularProgress 
          size={16} 
          sx={{ 
            color: "var(--color-primary)",
            ml: 1 
          }} 
        />
      )}
    </Box>
  );
}
