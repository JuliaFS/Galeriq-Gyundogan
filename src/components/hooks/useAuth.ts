import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import Firebase types and methods
import { createUserWithEmailAndPassword, User as FirebaseUser, getAuth, UserCredential } from 'firebase/auth';

import { authenticateUser, initializeUserProfileInFirestore, registerUserInFirebase } from "../../services/authService";
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





// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { authenticateUser, initializeUserProfileInFirestore, registerUserInFirebase } from "../../services/authService";
// import { setUser } from "../../store/userSlice";

// //import { User as FirebaseUser } from 'firebase/auth'; // Firebase User type

// interface User{
//   uid: string;
//   email: string;
//   displayName: string;
//   address: string;
//   profileImageUrl: string;
// }

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const initializeUserProfile = async (user: User) => {
//     const { uid, email, displayName, address, profileImageUrl} = user;
//     await initializeUserProfileInFirestore(uid, email || '', displayName || '', address || '', profileImageUrl || '');
//     dispatch(setUser({ uid, email: email || '', displayName: displayName || '', address: address || '', profileImageUrl: profileImageUrl || '' }));
//   };

//   const loginUser = async (email: string, password: string) => {
//     try {
//       const userCredential = await authenticateUser(email, password);
//       await initializeUserProfile(userCredential.user);
//       toast.success("Login successful");
//       navigate('/gallery');
//     } catch (error) {
//       toast.error(`Failed to login. ${error}`);
//     }
//   };

//   const registerUser = async (email: string, password: string, displayName?: string) => {
//     try {
//       const userCredential = await registerUserInFirebase(email, password);
//       await initializeUserProfile(userCredential.user);
//       dispatch(setUser({ uid: userCredential.user.uid, email, displayName: displayName || '' }));
//       toast.success("Registration successful");
//       navigate('/gallery');
//     } catch (error) {
//       toast.error(`Failed to register. ${error}`);
//     }
//   };

//   return { loginUser, registerUser };
// };

