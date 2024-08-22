import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import { Path } from "../../constants/constants";
import { UserProfile } from "../types/UserProfile";
import { initializeUserProfileInFirestore } from "../../services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      if (password !== rePass) {
        toast.error("Passwords do not match. Please try again.");
        return;
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Define UserProfile type based on the Firebase user
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '', // Ensure email is not null
        displayName: displayName || '', // Use the displayName from the form input
        address: '', // Address is not provided, can be set later
        profileImageUrl: user.photoURL || '' // Ensure photoURL is not null
      };

      // Initialize or update the user profile in Firestore
      await initializeUserProfileInFirestore(
        userProfile.uid,
        userProfile.email,
        userProfile.displayName,
        userProfile.address,
        userProfile.profileImageUrl
      );

      // Dispatch action to update Redux store
      dispatch(setUser(userProfile));

      toast.success("Registration successful");

      timeoutIdRef.current = setTimeout(() => {
        navigate(Path.Gallery);
      }, 3000); // Delay of 3 seconds

    } catch (err) {
      toast.error(`Failed to register. ${err}`);
    }
  };

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-10 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-8">Register</h2>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              required
            />
            <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
          </div>
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
          </div>
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <RiLockPasswordFill className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
          </div>
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="password"
              value={rePass}
              onChange={(e) => setRePass(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <RiLockPasswordFill className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
          </div>
          <button
            className="mt-8 p-2 font-bold border-2 border-[#e3fdf5] w-full"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="text-right">
          If you already have a profile click <Link to={Path.Login}><span className="font-bold">here</span></Link>
        </p>
      </div>
      <ToastContainer className="custom-toast-container" position="top-center"/>
    </div>
  );
};

export default Register;




