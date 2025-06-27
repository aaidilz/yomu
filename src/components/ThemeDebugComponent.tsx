import { useState, useEffect } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../configs/firebase-config";
import UserPreferencesService from "../services/UserPreferenceService";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeDebugComponent() {
  const [user] = useAuthState(auth);
  const { themeMode } = useTheme();
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const prefs = await UserPreferencesService.getUserPreferences();
      setPreferences(prefs);
      setLastSaved(prefs.updatedAt?.toLocaleString() || "Never");
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user, themeMode]);

  const testSaveTheme = async () => {
    if (!user) return;
    
    try {
      const testTheme = themeMode === "dark" ? "light" : "dark";
      await UserPreferencesService.updateTheme(testTheme);
      await loadPreferences();
      alert(`Test save successful! Saved theme: ${testTheme}`);
    } catch (error) {
      console.error("Test save failed:", error);
      alert("Test save failed!");
    }
  };

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Please login to see theme preferences saved to Firebase
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2, border: "1px solid", borderColor: "var(--color-border)", borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "var(--color-primary)" }}>
        Theme Debug Info
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-secondary)" }}>
        Current Theme: <strong style={{ color: "var(--color-text-primary)" }}>{themeMode}</strong>
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-secondary)" }}>
        Last Saved: <strong style={{ color: "var(--color-text-primary)" }}>{lastSaved || "Loading..."}</strong>
      </Typography>
      
      {preferences && (
        <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-secondary)" }}>
          Saved Theme: <strong style={{ color: "var(--color-text-primary)" }}>{preferences.theme}</strong>
        </Typography>
      )}
      
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={loadPreferences}
          disabled={loading}
          sx={{ 
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            "&:hover": {
              borderColor: "var(--color-primary)",
              backgroundColor: "rgba(151, 200, 235, 0.1)"
            }
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={testSaveTheme}
          sx={{ 
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            "&:hover": {
              borderColor: "var(--color-primary)",
              backgroundColor: "rgba(151, 200, 235, 0.1)"
            }
          }}
        >
          Test Save
        </Button>
      </Box>
    </Box>
  );
}
