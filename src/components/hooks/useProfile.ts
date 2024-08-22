import { toast } from "react-toastify";
import { setUser } from "../../store/userSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { firestore } from "../../firebaseConfig";
import { UserProfile } from "../types/UserProfile";



export const useProfile = () => {
  const dispatch = useDispatch();

  /**
   * Initializes or fetches the user profile from Firestore and updates the Redux store.
   * @param userProfile - The authenticated user profile object.
   */
  const initializeUserProfile = async (userProfile: UserProfile) => {
    try {
      const userDocRef = doc(firestore, "users", userProfile.uid);
      const userDoc = await getDoc(userDocRef);

      // Create a new document if it doesn't exist
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: userProfile.uid,
          email: userProfile.email,
          displayName: userProfile.displayName,
          address: userProfile.address,
          profileImageUrl: userProfile.profileImageUrl,
        });
      }

      // Retrieve the latest user data from Firestore
      const userData = userDoc.exists() ? userDoc.data() : userProfile;

      // Update Redux store with user data
      dispatch(setUser({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        address: userData.address,
        profileImageUrl: userData.profileImageUrl,
      }));

    } catch (error) {
      toast.error(`Failed to initialize user profile. ${error}`);
    }
  };

  // Additional profile-related functions can be added here

  return { initializeUserProfile };
};



// import { toast } from "react-toastify";
// import { setUser } from "../../store/userSlice";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { User } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { firestore } from "../../firebaseConfig";

// export const useProfile = () => {
//   const dispatch = useDispatch();

//   /**
//    * Initializes or fetches the user profile from Firestore and updates the Redux store.
//    * @param user - The authenticated user object.
//    * @param displayName - An optional display name to initialize the profile with.
//    * @param address - An optional address to initialize the profile with.
//    * @param profileImageUrl - An optional profile image URL to initialize the profile with.
//    */
//   const initializeUserProfile = async (
//     user: User,
//     displayName?: string,
//     address?: string,
//     profileImageUrl?: string
//   ) => {
//     try {
//       const userDocRef = doc(firestore, "users", user.uid);
//       const userDoc = await getDoc(userDocRef);

//       // Create a new document if it doesn't exist
//       if (!userDoc.exists()) {
//         await setDoc(userDocRef, {
//           uid: user.uid,
//           email: user.email,
//           displayName: displayName || user.displayName || '',
//           address: address || '',
//           profileImageUrl: profileImageUrl || '',
//         });
//       }

//       // Retrieve the latest user data from Firestore
//       const userData = userDoc.exists() ? userDoc.data() : {
//         uid: user.uid,
//         email: user.email,
//         displayName: displayName || user.displayName || '',
//         address: address || '',
//         profileImageUrl: profileImageUrl || '',
//       };

//       // Update Redux store with user data
//       dispatch(setUser({
//         uid: userData.uid,
//         email: userData.email,
//         displayName: userData.displayName,
//         address: userData.address,
//         profileImageUrl: userData.profileImageUrl,
//       }));

//     } catch (error) {
//       toast.error(`Failed to initialize user profile. ${error}`);
//     }
//   };

//   // Additional profile-related functions can be added here

//   return { initializeUserProfile };
// };

  