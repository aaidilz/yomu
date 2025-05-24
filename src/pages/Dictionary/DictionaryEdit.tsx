import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../configs/firebase-config";
import DictionaryService from "../../services/DictionaryService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Typography } from "@mui/material";
import * as wanakana from "wanakana";

// Validation patterns
const JAPANESE_REGEX = /^[\u4E00-\u9FAF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF]+$/;
const KATAKANA_REGEX = /^[\u30A0-\u30FF]+$/;
const ROMANIZATION_REGEX = /^[a-zA-Z\s\-_!?]+$/;

interface Dictionary {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

export default function DictionaryEdit() {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Dictionary, string>>>({});
  const [saving, setSaving] = useState(false);
  const [user] = useAuthState(auth);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dictionary Edit | Yomu";
  }, []);

  useEffect(() => {
    const fetchDictionary = async () => {
      if (!user || !id) return;

      try {
        const dictionaries = await DictionaryService.getUserDictionaries();
        const data = dictionaries.find((dictionary) => dictionary.id === id);
        if (!data) {
          console.error("Dictionary not found");
          navigate("/dictionary");
          return;
        }
        setDictionary(data);
      } catch (error) {
        console.error("Error fetching dictionary:", error);
        navigate("/dictionary");
      }
    };

    fetchDictionary();
  }, [user, id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;
  
    // Object yang akan menyimpan perubahan field
    const updatedFields: { [key: string]: string } = {};
  
    if (name === "hiragana") {
      newValue = wanakana.toHiragana(value);
      updatedFields[name] = newValue;
    } else if (name === "katakana") {
      newValue = wanakana.toKatakana(value);
      updatedFields[name] = newValue;
    } else if (name === "romaji") {
      newValue = wanakana.toRomaji(value); // tetap konversi ke romaji
      updatedFields["romaji"] = newValue;
      updatedFields["hiragana"] = wanakana.toHiragana(value); // auto update hiragana
    } else {
      updatedFields[name] = newValue;
    }
  
    setDictionary((prev) =>
      prev ? { ...prev, ...updatedFields } : null
    );
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  

  const validate = () => {
    if (!dictionary) return false;
    const newErrors: Partial<Record<keyof Dictionary, string>> = {};
    
    // Required fields validation
    const requiredFields: (keyof Dictionary)[] = ['kanji', 'arti', 'kategori'];
    requiredFields.forEach(field => {
      if (!dictionary[field].trim()) {
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

    if (dictionary.arti && !ROMANIZATION_REGEX.test(dictionary.arti)) {
      newErrors.arti = "Hanya boleh menggunakan huruf latin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!dictionary || !validate()) return;
    setSaving(true);
    try {
      await DictionaryService.updateDictionary(dictionary.id, dictionary);
      navigate("/dictionary");
    } catch (error) {
      console.error("Error updating dictionary:", error);
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

  if (!dictionary) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <p className="text-white">Memuat data dictionary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 md:p-8 border border-[#64E9EE]/20 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#64E9EE] drop-shadow-lg">
            Edit Dictionary
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Japanese Characters Group */}
          <Box sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid #64E9EE20',
            bgcolor: 'rgba(100, 233, 238, 0.05)'
          }}>
            <Typography variant="h6" sx={{ color: '#64E9EE', mb: 2 }}>
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
          </Box>

          {/* Translation & Metadata Group */}
          <Box sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid #64E9EE20',
            bgcolor: 'rgba(100, 233, 238, 0.05)'
          }}>
            <Typography variant="h6" sx={{ color: '#64E9EE', mb: 2 }}>
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
                {["Kata Benda", "Kata sifat", "Slang", "Bisnis", "Umum"].map((option) => (
                  <option key={option} value={option} style={{ background: '#2D3748' }}>
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
            value={dictionary.romaji}
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
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </span>
        </Button>
      </div>
    </div>
  );
}