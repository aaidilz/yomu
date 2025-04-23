import { db, auth } from "../configs/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

interface Note {
  id: string;
  title: string;
  content: string;
}

class NoteService {
  private getUserNotesRef() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return collection(db, "users", user.uid, "notes");
  }

  async addNote(noteData: Omit<Note, "id">) {
    const ref = this.getUserNotesRef();
    if (!ref) throw new Error("User not authenticated");

    return addDoc(ref, {
      ...noteData,
      createdAt: Timestamp.now(),
    });
  }

  async getUserNotes(): Promise<Note[]> {
    const ref = this.getUserNotesRef();
    if (!ref) return [];

    const snapshot = await getDocs(ref);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Note, "id">),
    }));
  }

  async updateNote(id: string, updatedData: Partial<Omit<Note, "id">>) {
    const ref = this.getUserNotesRef();
    if (!ref) throw new Error("User not authenticated");

    const noteRef = doc(ref, id);
    return updateDoc(noteRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteNote(id: string) {
    const ref = this.getUserNotesRef();
    if (!ref) throw new Error("User not authenticated");

    const noteRef = doc(ref, id);
    return deleteDoc(noteRef);
  }
}

export default new NoteService();
