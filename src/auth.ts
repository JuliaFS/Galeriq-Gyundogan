import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";

export const authenticateUser = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};