import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../configs/firebase-config";
import FlashcardService from "../../services/FlashcardService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import * as wanakana from 'wanakana';

// Validation patterns
const JAPANESE_REGEX = /^[\u4E00-\u9FAF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF]+$/;
const KATAKANA_REGEX = /^[\u30A0-\u30FF]+$/;
const ROMANIZATION_REGEX = /^[a-zA-Z\s\-_!?]+$/;

interface Flashcard {
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

export default function FlashcardCreate() {
  const [flashcard, setFlashcard] = useState<Flashcard>({
    hiragana: "",
    kanji: "",
    katakana: "",
    romaji: "",
    arti: "",
    kategori: "Umum",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Flashcard, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;
  
    // Objek baru yang akan diperbarui ke state
    const updatedFields: { [key: string]: string } = { [name]: newValue };
  
    if (name === "hiragana") {
      newValue = wanakana.toHiragana(value);
      updatedFields[name] = newValue;
    } else if (name === "katakana") {
      newValue = wanakana.toKatakana(value);
      updatedFields[name] = newValue;
    } else if (name === "romaji") {
      newValue = value;
      updatedFields["romaji"] = newValue;
      updatedFields["hiragana"] = wanakana.toHiragana(value); // auto fill hiragana
    }
  
    setFlashcard((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  
  const validate = () => {
    const newErrors: Partial<Record<keyof Flashcard, string>> = {};

    // Required fields validation
    const requiredFields: (keyof Flashcard)[] = ["kanji", "arti", "kategori"];
    requiredFields.forEach((field) => {
      if (!flashcard[field].trim()) {
        newErrors[field] = "Kolom ini wajib diisi";
      }
    });

    // Format validation
    if (flashcard.kanji && !JAPANESE_REGEX.test(flashcard.kanji)) {
      newErrors.kanji = "Hanya boleh menggunakan karakter Jepang";
    }

    if (flashcard.katakana && !KATAKANA_REGEX.test(flashcard.katakana)) {
      newErrors.katakana = "Hanya boleh menggunakan karakter Katakana Jepang";
    }

    if (flashcard.arti && !ROMANIZATION_REGEX.test(flashcard.arti)) {
      newErrors.arti = "Hanya boleh menggunakan huruf latin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (!user) return;
      await FlashcardService.addFlashcard(flashcard);
      navigate("/flashcard");
    } catch (error) {
      console.error("Error saving flashcard:", error);
    }
    setSaving(false);
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "#4A5568" },
      "&:hover fieldset": { borderColor: "#64E9EE" },
      "&.Mui-focused fieldset": { borderColor: "#64E9EE" },
    },
    "& .MuiInputLabel-root": { color: "#A0AEC0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#64E9EE" },
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 md:p-8 border border-[#64E9EE]/20 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#64E9EE] drop-shadow-lg">
            Buat Flashcard Baru
          </h1>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/flashcard")}
            sx={{
              color: "#64E9EE",
              borderColor: "#64E9EE",
              "&:hover": {
                borderColor: "#53cbd1",
                backgroundColor: "#64E9EE10",
              },
            }}
          >
            Kembali
          </Button>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Japanese Characters Group */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #64E9EE20",
              bgcolor: "rgba(100, 233, 238, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#64E9EE", mb: 2 }}>
              Karakter Jepang
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Kanji"
                name="kanji"
                value={flashcard.kanji}
                onChange={handleChange}
                error={!!errors.kanji}
                helperText={errors.kanji}
                variant="outlined"
                required
                sx={textFieldStyles}
              />
              <TextField
                label="Hiragana"
                name="hiragana"
                value={flashcard.hiragana}
                onChange={handleChange}
                variant="outlined"
                sx={textFieldStyles}
              />
              <TextField
                label="Katakana"
                name="katakana"
                value={flashcard.katakana}
                onChange={handleChange}
                error={!!errors.katakana}
                helperText={errors.katakana}
                variant="outlined"
                sx={textFieldStyles}
              />
            </div>
          </Box>

          {/* Translation & Metadata Group */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #64E9EE20",
              bgcolor: "rgba(100, 233, 238, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#64E9EE", mb: 2 }}>
              Terjemahan & Kategori
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Arti (Indonesia)"
                name="arti"
                value={flashcard.arti}
                onChange={handleChange}
                error={!!errors.arti}
                helperText={errors.arti}
                variant="outlined"
                required
                sx={textFieldStyles}
              />
              <TextField
                label="Kategori"
                name="kategori"
                value={flashcard.kategori}
                onChange={handleChange}
                error={!!errors.kategori}
                helperText={errors.kategori}
                variant="outlined"
                required
                select
                SelectProps={{ native: true }}
                sx={textFieldStyles}
              >
                {["Kata Benda", "Kata sifat", "Slang", "Bisnis", "Umum"].map((option) => (
                  <option
                    key={option}
                    value={option}
                    style={{ background: "#2D3748" }}
                  >
                    {option}
                  </option>
                ))}
              </TextField>
            </div>
          </Box>

          {/* Romanization */}
          <TextField
            label="Romaji"
            name="romaji"
            value={flashcard.romaji}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={textFieldStyles}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={<SaveIcon />}
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            backgroundColor: "#64E9EE",
            "&:hover": {
              backgroundColor: "#53cbd1",
              boxShadow: "0 0 15px rgba(100, 233, 238, 0.3)",
            },
            "&.Mui-disabled": {
              backgroundColor: "#64E9EE50",
              color: "#ffffff80",
            },
          }}
        >
          <span className="font-bold text-lg">
            {saving ? "Menyimpan..." : "Simpan Flashcard"}
          </span>
        </Button>
      </div>
    </div>
  );
}
