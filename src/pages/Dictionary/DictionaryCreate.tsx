import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../configs/firebase-config";
import DictionaryService from "../../services/DictionaryService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Switch, Typography } from "@mui/material";
import * as wanakana from "wanakana";

// Validation patterns
const JAPANESE_REGEX = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+$/;
const KATAKANA_REGEX = /^[\u30A0-\u30FF]+$/;
const ROMANIZATION_REGEX = /^[a-zA-Z\s\-_!?]+$/;

interface Dictionary {
  id?: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

export default function DictionaryCreate() {
  const [dictionary, setDictionary] = useState<Dictionary>({
    hiragana: "",
    kanji: "",
    katakana: "",
    romaji: "",
    arti: "",
    kategori: "Umum",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Dictionary, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [autoConvertHiragana, setAutoConvertHiragana] = useState(true);
  const [autoConvertKatakana, setAutoConvertKatakana] = useState(true);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dictionary Create | Yomu";
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedFields: { [key: string]: string } = {};

    if (name === "hiragana") {
      if (autoConvertHiragana) {
        updatedFields.hiragana = wanakana.toHiragana(value);
      } else {
        updatedFields.hiragana = value;
      }
    } else if (name === "katakana") {
      if (autoConvertKatakana) {
        updatedFields.katakana = wanakana.toKatakana(value);
      } else {
        updatedFields.katakana = value;
      }
    } else if (name === "romaji") {
      updatedFields.romaji = value;

      if (autoConvertHiragana) {
        updatedFields.hiragana = wanakana.toHiragana(value);
      }

      if (autoConvertKatakana) {
        updatedFields.katakana = wanakana.toKatakana(value);
      }
    } else {
      updatedFields[name] = value;
    }

    setDictionary((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = async () => {
    const newErrors: Partial<Record<keyof Dictionary, string>> = {};

    // Required fields validation
    const requiredFields: (keyof Dictionary)[] = ["kanji", "arti", "kategori"];
    requiredFields.forEach((field) => {
      if (!dictionary[field]?.trim()) {
        newErrors[field] = "Kolom ini wajib diisi";
      }
    });

    // Format validation
    if (dictionary.kanji && !JAPANESE_REGEX.test(dictionary.kanji)) {
      newErrors.kanji = "Hanya boleh menggunakan karakter Jepang";
    }

    if (dictionary.katakana && !KATAKANA_REGEX.test(dictionary.katakana)) {
      newErrors.katakana = "Hanya boleh menggunakan karakter Katakana Jepang";
    }

    if (dictionary.hiragana && !JAPANESE_REGEX.test(dictionary.hiragana)) {
      newErrors.hiragana = "Hanya boleh menggunakan karakter Hiragana Jepang";
    }

    if (dictionary.arti && !ROMANIZATION_REGEX.test(dictionary.arti)) {
      newErrors.arti = "Hanya boleh menggunakan huruf latin";
    }

    if (dictionary.kanji) {
      try {
        const userDictionaries = await DictionaryService.getUserDictionaries();
        const isDuplicate = userDictionaries.some(
          (entry: Dictionary) =>
            entry.kanji === dictionary.kanji && entry.id !== dictionary.id // agar tidak menganggap dirinya sendiri sebagai duplikat saat update
        );

        if (isDuplicate) {
          newErrors.kanji = "Kanji ini sudah ada dalam kamus Anda";
        }
      } catch (err) {
        console.error("Gagal memeriksa duplikat kanji:", err);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid) return;

    setSaving(true);
    try {
      if (!user) return;
      await DictionaryService.addDictionary(dictionary);
      navigate("/dictionary");
    } catch (error) {
      console.error("Error saving dictionary:", error);
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
            Buat Dictionary Baru
          </h1>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dictionary")}
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

        {/* Toggle untuk Hiragana */}
        <Box  sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #64E9EE20",
              bgcolor: "rgba(100, 233, 238, 0.05)",
              mb: 3,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Toggle untuk Hiragana */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#A0AEC0" }}>Autofill Hiragana</Typography>
              <Switch
              checked={autoConvertHiragana}
              onChange={() => setAutoConvertHiragana(!autoConvertHiragana)}
              color="primary"
              />
            </Box>
            {/* Toggle untuk Katakana */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ color: "#A0AEC0" }}>Autofill Katakana</Typography>
              <Switch
              checked={autoConvertKatakana}
              onChange={() => setAutoConvertKatakana(!autoConvertKatakana)}
              color="primary"
              />
            </Box>
            </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Romaji"
              name="romaji"
              value={dictionary.romaji}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={textFieldStyles}
            />
          </Box>
        </Box>

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
                value={dictionary.kanji}
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
                value={dictionary.hiragana}
                onChange={handleChange}
                error={!!errors.hiragana}
                helperText={errors.hiragana}
                variant="outlined"
                sx={textFieldStyles}
              />
              <TextField
                label="Katakana"
                name="katakana"
                value={dictionary.katakana}
                onChange={handleChange}
                error={!!errors.katakana}
                helperText={errors.katakana}
                variant="outlined"
                sx={textFieldStyles}
              />
            </div>
            <Typography variant="body2" sx={{ color: "#A0AEC0", mt: 2 }}>
              <b>Info:</b> Karena kanji tergantung konteks, bisa copy paste saja
              dari sumber lain
              <br />
            </Typography>
            <a
              href="https://jisho.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              https://jisho.org/
            </a>
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
                value={dictionary.arti}
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
                value={dictionary.kategori}
                onChange={handleChange}
                error={!!errors.kategori}
                helperText={errors.kategori}
                variant="outlined"
                required
                select
                SelectProps={{ native: true }}
                sx={textFieldStyles}
              >
                {["Kata Benda", "Kata sifat", "Slang", "Bisnis", "Umum"].map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                      style={{ background: "#2D3748" }}
                    >
                      {option}
                    </option>
                  )
                )}
              </TextField>
            </div>
          </Box>

          {/* Romanization */}
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
            {saving ? "Menyimpan..." : "Simpan Dictionary"}
          </span>
        </Button>
      </div>
    </div>
  );
}
