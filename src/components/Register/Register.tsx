import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { saveUserData, UserData } from "../../services/firestoreService";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { Path } from "../../constants/constants";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");
  //const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up the timeout on component unmount
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    //setError(null);

    try {
      if (password !== rePass) {
      //setError("Passwords do not match. Please try again.");
      console.log("Passwords do not match. Please try again.")
        toast.error("Passwords do not match. Please try again.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid, email: userEmail } = userCredential.user;

      if (!userEmail) {
        toast.error("No email found for this user.");
      }

      const userData: UserData = { uid, email: userEmail };
      await saveUserData(uid, userData);

      dispatch(setUser(userData));
      //alert("Registration successful");
      toast.success("Registration successful");

      timeoutIdRef.current =  setTimeout(() => {
        navigate(Path.Gallery);
      }, 3000); // Delay of 3 seconds

    } catch (err) {
      console.log(err)
      toast.error(`${err}`);
      
      //setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-10 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-8">Register</h2>
        {/*{error && <p style={{ color: "red" }}>{error}</p>}*/}
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
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
              placeholder="Password"
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
            If you already have profile click <Link to={Path.Login}><span className="font-bold">here</span></Link>
        </p>
      </div>
      <ToastContainer className="custom-toast-container" position="top-center"/>
    </div>
  );
};

export default Register;
