import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import Firebase types and methods
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import { authenticateUser, initializeUserProfileInFirestore} from "../../services/authService";
import { setUser } from "../../store/userSlice";
import { UserProfile } from "../types/UserProfile";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to initialize user profile
  const initializeUserProfile = async (userProfile: UserProfile) => {
    try {
      // Pass the whole userProfile object directly to initializeUserProfileInFirestore
      await initializeUserProfileInFirestore(
        userProfile.uid,
        userProfile.email,
        userProfile.displayName,
        userProfile.address,
        userProfile.profileImageUrl
      );
  
      // Dispatch the user profile to the Redux store
      dispatch(setUser(userProfile));
    } catch (error) {
      console.error("Failed to initialize user profile:", error);
    }
  };

  // Function to log in a user
// Function to log in a user
const loginUser = async (email: string, password: string) => {
  try {
    // Directly retrieve the UserProfile object
    const userProfile: UserProfile = await authenticateUser(email, password);

    // No need to destructure `userCredential`, use the `userProfile` directly
    await initializeUserProfile(userProfile);

    toast.success("Login successful");
    navigate('/gallery');
  } catch (error) {
    toast.error(`Failed to login. ${error}`);
  }
};

  // Function to register a user
  const registerUser = async (email: string, password: string): Promise<UserProfile> => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    // Initialize the user profile in Firestore with default or empty values
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      address: '', // Default empty address
      profileImageUrl: user.photoURL || '',
    });
  
    // Return the UserProfile object
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      address: '', // Default empty address
      profileImageUrl: user.photoURL || '',
    };
  };

  return { loginUser, registerUser };
};
