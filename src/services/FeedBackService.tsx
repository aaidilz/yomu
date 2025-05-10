import { db } from "../configs/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

interface Feedback {
  id: string;
  name: string;
  email: string;
  feedback: string;
}

class FeedbackService {
  private getPublicFeedbacksRef() {
    return collection(db, "public_feedbacks");
  }

  async addFeedback(feedbackData: Omit<Feedback, "id">) {
    const ref = this.getPublicFeedbacksRef();
    return addDoc(ref, {
      ...feedbackData,
      createdAt: Timestamp.now(),
    });
  }

  async updateFeedback(id: string, updatedData: Partial<Omit<Feedback, "id">>) {
    const ref = this.getPublicFeedbacksRef();
    const feedbackRef = doc(ref, id);
    return updateDoc(feedbackRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteAllFeedbacks() {
    const ref = this.getPublicFeedbacksRef();
    const batch = writeBatch(db);
    const snapshot = await getDocs(ref);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    return batch.commit();
  }
}

export default new FeedbackService();
