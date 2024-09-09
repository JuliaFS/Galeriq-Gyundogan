import { ImageDataProps } from '../components/types/imageType';
import { firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, query, limit, getDocs } from "firebase/firestore";
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

export const fetchLast8Pictures = async (): Promise<ImageDataProps[]> => {
  try {
    const picturesRef = collection(firestore, "images");
    const q = query(picturesRef, limit(8));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents found.");
      return [];
    }

    const last8Pictures: ImageDataProps[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Document data:", data);
      last8Pictures.push({ id: doc.id, ...data } as ImageDataProps);
    });

    console.log("Retrieved pictures:", last8Pictures);
    return last8Pictures;
  } catch (error) {
    console.error("Error fetching pictures:", error);
    return [];
  }
};