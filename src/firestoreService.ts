import { firestore } from './firebaseConfig';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export interface UserData {
  imageUrl: string;
}

export const saveUserData = async (userId: string, data: UserData): Promise<void> => {
  const userDoc = doc(collection(firestore, "users"), userId);
  await setDoc(userDoc, data, { merge: true });
};

export const getUserData = async (userId: string): Promise<UserData | undefined> => {
  const userDoc = doc(collection(firestore, "users"), userId);
  const docSnapshot = await getDoc(userDoc);
  return docSnapshot.exists() ? (docSnapshot.data() as UserData) : undefined;
};