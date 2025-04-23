import { auth, db, googleProvider } from "../configs/firebase-config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

// Referensi ke koleksi users di Firestore
const usersCollection = collection(db, "users");

class AuthService {
  // 🟢 Login dengan Google SSO
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Simpan data user ke Firestore jika belum ada
    await this.saveUserData(
      user.uid,
      user.displayName || "",
      user.email || "",
      user.photoURL || "",
      "google"
    );
  }

  // 🟢 Login dengan Email & Password
  async signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Simpan data user ke Firestore jika belum ada
    await this.saveUserData(
      user.uid,
      user.displayName || "",
      email,
      "",
      "email"
    );
  }

  // 🟢 Register dengan Email & Password
  async registerWithEmail(name: string, email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Simpan data user baru ke Firestore
    await this.saveUserData(user.uid, name, email, "", "email");
  }

  // 🔴 Logout User
  async logout() {
    return signOut(auth);
  }

  // 🟢 Simpan Data User ke Firestore
  async saveUserData(
    uid: string,
    name: string,
    email: string,
    photoURL: string,
    provider: "google" | "email"
  ) {
    const userDocRef = doc(usersCollection, uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      await setDoc(userDocRef, {
        name,
        email,
        photoURL,
        provider,
        createdAt: Timestamp.now(),
      });
    }
  }
}

export default new AuthService();
