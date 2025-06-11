
import NoteService from "../../services/NoteService";
type ChatMessage = { role: "user" | "model" | "ai"; text: string };

export interface NoteData {
  title: string;
  content: string;
}

export const handleNoteIfAny = async (
  modelText: string,
  currentHistory: ChatMessage[]
): Promise<{ newHistory: ChatMessage[]; saveSuccess: boolean }> => {
  const jsonMatch = modelText.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    return { newHistory: currentHistory, saveSuccess: false };
  }

  try {
    const parsedData = JSON.parse(jsonMatch[0]);

    // Validasi struktur note
    if (!parsedData.title || !parsedData.content) {
      throw new Error("Invalid note structure");
    }

    const noteData: NoteData = {
      title: parsedData.title,
      content: parsedData.content,
    };

    await NoteService.addNote(noteData);

    const confirmationMessage: ChatMessage = {
      role: "ai",
      text: "📝 Catatan berhasil disimpan! Yuk cek di halaman notes~",
    };

    return {
      newHistory: [...currentHistory, confirmationMessage],
      saveSuccess: true,
    };
  } catch (error) {
    console.error("Note save error:", error);
    const errorMessage: ChatMessage = {
      role: "ai",
      text: "❌ Gagal menyimpan catatan. Pastikan formatnya benar ya: { title: '...', content: '...' }",
    };

    return {
      newHistory: [...currentHistory, errorMessage],
      saveSuccess: false,
    };
  }
};

export default handleNoteIfAny;