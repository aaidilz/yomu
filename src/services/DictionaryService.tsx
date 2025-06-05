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

interface Dictionary {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

const validCategories = ["Kata benda", "Kata sifat", "Slang", "Bisnis", "Umum"];

class DictionaryService {
  private getUserDictionariesRef() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
      return null;
    }

    return collection(db, "users", user.uid, "dictionaries");
  }

 async addDictionary(dictionaryData: Omit<Dictionary, "id">) {
  if (!validCategories.includes(dictionaryData.kategori)) {
    throw new Error(`Kategori tidak valid. Harus salah satu dari: ${validCategories.join(", ")}`);
  }

  const ref = this.getUserDictionariesRef();
  if (!ref) throw new Error("User not authenticated");

  return addDoc(ref, {
    ...dictionaryData,
    createdAt: Timestamp.now(),
  });
}

  async getUserDictionaries(): Promise<Dictionary[]> {
    const ref = this.getUserDictionariesRef();
    if (!ref) return [];

    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Dictionary, "id">),
    }));
  }

  async updateDictionary(
    id: string,
    updatedData: Partial<Omit<Dictionary, "id">>
  ) {
    const ref = this.getUserDictionariesRef();
    if (!ref) throw new Error("User not authenticated");

    const dictionaryRef = doc(ref, id);
    return updateDoc(dictionaryRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteDictionary(id: string) {
    const ref = this.getUserDictionariesRef();
    if (!ref) throw new Error("User not authenticated");

    const dictionaryRef = doc(ref, id);
    return deleteDoc(dictionaryRef);
  }

  async importDictionaries(dictionaries: Dictionary[]) {
    const ref = this.getUserDictionariesRef();
    if (!ref) throw new Error("User not authenticated");

    // Ambil semua dictionaries yang ada
    const snapshot = await getDocs(ref);
    const existingDictionaries = snapshot.docs.map((doc) => doc.data());
    const batch = writeBatch(db);

    for (const dictionary of dictionaries) {
      // Cek apakah dictionary sudah ada berdasarkan hiragana atau kanji
      const isExist = existingDictionaries.some(
        (existing) =>
          existing.hiragana === dictionary.hiragana ||
          existing.kanji === dictionary.kanji
      );

      if (!isExist) {
        const newDocRef = doc(ref); // Buat dokumen baru
        batch.set(newDocRef, {
          ...dictionary,
          createdAt: Timestamp.now(),
        });
      }
    }

    await batch.commit(); // Simpan semua perubahan sekaligus
  }

  async deleteAllDictionaries() {
    const ref = this.getUserDictionariesRef();
    if (!ref) throw new Error("User not authenticated");

    const snapshot = await getDocs(ref);
    const batch = writeBatch(db);

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export default new DictionaryService();
