

import { ChatMessage } from "../types/chat";
import  DirectorySrvices from "../../services/DictionaryService";

export const handleDictionaryIfAny = async (
  modelText: string,
  currentHistory: ChatMessage[]
): Promise<{ newHistory: ChatMessage[]; saveSuccess: boolean }> => {
  const jsonMatch = modelText.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    return { newHistory: currentHistory, saveSuccess: false };
  }

  try {
    const parsedDict = JSON.parse(jsonMatch[0]);
    await DirectorySrvices.addDictionary(parsedDict);

    const confirmationMessage: ChatMessage = {
      role: "assistant",
      text: "✅ Yuki udah tambahin data itu ke dictionary! Coba cek di halaman dictionary ya~",
    };

    return {
      newHistory: [...currentHistory, confirmationMessage],
      saveSuccess: true,
    };
  } catch (error) {
    console.error("Dictionary save error:", error);
    const errorMessage: ChatMessage = {
      role: "assistant",
      text: "❌ Gagal menyimpan dictionary. Coba cek format datanya ya!",
    };

    return {
      newHistory: [...currentHistory, errorMessage],
      saveSuccess: false,
    };
  }
};

export default handleDictionaryIfAny;
