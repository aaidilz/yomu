import { auth, db } from "../configs/firebase-config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
  updatedAt: Date;
}

class UserPreferencesService {
  private getPreferencesDocRef(uid: string) {
return doc(db, "users", uid, "user_preferences", "settings");
  }

  // Mendapatkan preferensi user
  async getUserPreferences(): Promise<UserPreferences> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    const preferencesDocRef = this.getPreferencesDocRef(currentUser.uid);
    const snapshot = await getDoc(preferencesDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        theme: data.theme || "dark",
        notifications: data.notifications || true,
        language: data.language || "en",
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } else {
      // Jika belum ada preferensi, buat default
      const defaultPreferences: UserPreferences = {
        theme: "dark",
        notifications: true,
        language: "en",
        updatedAt: new Date(),
      };
      await this.saveUserPreferences(defaultPreferences);
      return defaultPreferences;
    }
  }

  // Menyimpan preferensi user
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    const preferencesDocRef = this.getPreferencesDocRef(currentUser.uid);
    await setDoc(preferencesDocRef, {
      ...preferences,
      updatedAt: new Date(),
    });
  }

  // Update hanya tema
  async updateTheme(theme: "light" | "dark"): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    console.log(`Updating theme to ${theme} for user: ${currentUser.uid}`);

    try {
      const preferencesDocRef = this.getPreferencesDocRef(currentUser.uid);
      await updateDoc(preferencesDocRef, {
        theme,
        updatedAt: new Date(),
      });
      console.log(`Theme ${theme} successfully updated in Firebase`);
    } catch (error) {
      console.error("Error updating theme in Firebase:", error);
      throw error;
    }
  }

  // Update notifikasi
  async updateNotifications(notifications: boolean): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    const preferencesDocRef = this.getPreferencesDocRef(currentUser.uid);
    await updateDoc(preferencesDocRef, {
      notifications,
      updatedAt: new Date(),
    });
  }

  // Update bahasa
  async updateLanguage(language: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently logged in");
    }

    const preferencesDocRef = this.getPreferencesDocRef(currentUser.uid);
    await updateDoc(preferencesDocRef, {
      language,
      updatedAt: new Date(),
    });
  }
}

export default new UserPreferencesService();
