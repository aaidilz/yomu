import { db, auth } from "../configs/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

interface Flashcard {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

class FlashcardService {
  private getUserFlashcardsRef() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
      return null;
    }

    return collection(db, "users", user.uid, "flashcards");
  }

  async addFlashcard(flashcardData: Omit<Flashcard, "id">) {
    const ref = this.getUserFlashcardsRef();
    if (!ref) throw new Error("User not authenticated");

    return addDoc(ref, {
      ...flashcardData,
      createdAt: Timestamp.now(),
    });
  }

  async getUserFlashcards(): Promise<Flashcard[]> {
    const ref = this.getUserFlashcardsRef();
    if (!ref) return [];

    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Flashcard, "id">),
    }));
  }

  async updateFlashcard(
    id: string,
    updatedData: Partial<Omit<Flashcard, "id">>
  ) {
    const ref = this.getUserFlashcardsRef();
    if (!ref) throw new Error("User not authenticated");

    const flashcardRef = doc(ref, id);
    return updateDoc(flashcardRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteFlashcard(id: string) {
    const ref = this.getUserFlashcardsRef();
    if (!ref) throw new Error("User not authenticated");

    const flashcardRef = doc(ref, id);
    return deleteDoc(flashcardRef);
  }

  async importFlashcards(flashcards: Flashcard[]) {
    const ref = this.getUserFlashcardsRef();
    if (!ref) throw new Error("User not authenticated");

    // Ambil semua flashcards yang ada
    const snapshot = await getDocs(ref);
    const existingFlashcards = snapshot.docs.map((doc) => doc.data());
    const batch = writeBatch(db);

    for (const flashcard of flashcards) {
      // Cek apakah flashcard sudah ada berdasarkan hiragana atau kanji
      const isExist = existingFlashcards.some(
        (existing) =>
          existing.hiragana === flashcard.hiragana ||
          existing.kanji === flashcard.kanji
      );

      if (!isExist) {
        const newDocRef = doc(ref); // Buat dokumen baru
        batch.set(newDocRef, {
          ...flashcard,
          createdAt: Timestamp.now(),
        });
      }
    }

    await batch.commit(); // Simpan semua perubahan sekaligus
  }

  async deleteAllFlashcards() {
    const ref = this.getUserFlashcardsRef();
    if (!ref) throw new Error("User not authenticated");

    const snapshot = await getDocs(ref);
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export default new FlashcardService();
