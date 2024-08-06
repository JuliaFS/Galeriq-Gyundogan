import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};