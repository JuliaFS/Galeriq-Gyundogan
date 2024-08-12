import { firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";


  export interface UserData {
    uid: string | null;
    email: string | null;
  }

export const getUserData = async (userId: string): Promise<UserData | undefined> => {
  const userDoc = doc(firestore, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  return docSnapshot.exists() ? (docSnapshot.data() as UserData) : undefined;
};

export const saveUserData = async (userId: string, data: UserData): Promise<void> => {
  const userDoc = doc(firestore, "users", userId);
  await setDoc(userDoc, data, { merge: true });
};