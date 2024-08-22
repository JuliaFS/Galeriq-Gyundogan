import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, updateEmail, updateProfile, User as FirebaseUser } from "firebase/auth";
import { firestore, storage } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserProfile } from "../components/types/UserProfile";

// Authenticate user and return user profile
export const authenticateUser = async (email: string, password: string): Promise<UserProfile> => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch user profile from Firestore
  const userDocRef = doc(firestore, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName || '',
      address: userData.address || '',
      profileImageUrl: userData.profileImageUrl || '',
    };
  } else {
    throw new Error("User profile does not exist in Firestore.");
  }
};

// Register a new user and return userCredential
export const registerUserInFirebase = async (email: string, password: string): Promise<FirebaseUser> => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Initialize or update user profile in Firestore
export const initializeUserProfileInFirestore = async (
  uid: string,
  email: string | null,
  displayName: string = '',
  address: string = '',
  profileImageUrl: string = ''
): Promise<void> => {
  const userDocRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, { uid, email, displayName, address, profileImageUrl });
  } else {
    // Optionally update the document if it already exists
    await setDoc(userDocRef, { displayName, address, profileImageUrl }, { merge: true });
  }
};

// Upload profile image and return the URL
export const uploadProfileImage = async (uid: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `profileImages/${uid}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Update user profile including optional fields
export const updateUserProfile = async (
  uid: string,
  displayName: string,
  email: string,
  password?: string,
  address?: string,
  profileImage?: File
): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  // Update profile info
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  if (email) {
    await updateEmail(user, email);
  }

  if (password) {
    await updatePassword(user, password);
  }

  // Upload profile image if provided
  let profileImageUrl = '';
  if (profileImage) {
    profileImageUrl = await uploadProfileImage(uid, profileImage);
  }

  // Update Firestore data
  const userDocRef = doc(firestore, "users", uid);
  await setDoc(userDocRef, {
    uid,
    email,
    displayName,
    address,
    profileImageUrl,
  }, { merge: true });

  return profileImageUrl;
};
