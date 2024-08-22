import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { authenticateUser } from "../../services/authService";
import { Path } from "../../constants/constants";
import { useProfile } from "../hooks/useProfile";
import { UserProfile } from "../types/UserProfile";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { initializeUserProfile } = useProfile(); // Destructure the initializeUserProfile function from useProfile
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const userProfile: UserProfile = await authenticateUser(email, password);
  
      // Pass the correctly typed userProfile object
      await initializeUserProfile(userProfile);
  
      toast.success("Login successful");
  
      timeoutIdRef.current = setTimeout(() => {
        navigate(Path.Gallery);
      }, 3000);
    } catch (err) {
      toast.error(`Failed to login. ${err}`);
    }
  };
  

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-16 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-8">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
          <button
            className="mt-8 p-2 font-bold border-2 border-[#e3fdf5] w-full"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="text-right">
          If you don't have a profile, click <Link to={Path.Register}><span className="font-bold">here</span></Link>
        </p>
      </div>
      <ToastContainer className="custom-toast-container" position="top-center" />
    </div>
  );
};

export default Login;





// import { useEffect, useRef, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaUserEdit } from "react-icons/fa";
// import { RiLockPasswordFill } from "react-icons/ri";

// import { authenticateUser } from "../../services/authService";
// import { getUserData, saveUserData } from "../../services/firestoreService";

// import { setUser } from "../../store/userSlice";
// import { Path } from "../../constants/constants";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   //const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     // Clean up the timeout on component unmount
//     return () => {
//       if (timeoutIdRef.current) {
//         clearTimeout(timeoutIdRef.current);
//       }
//     };
//   }, []);

//   const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault(); // Prevent default form submission

//     try {
//       const userCredential = await authenticateUser(email, password);
//       const { uid, email: userEmail } = userCredential.user;

//       // Check if email exists
//       if (!userEmail) {
//         throw new Error("No email found for this user.");
//       }

//       // Fetch or create user data in Firestore
//       let userData = await getUserData(uid);
//       if (!userData) {
//         userData = { uid, email: userEmail };
//         await saveUserData(uid, userData);
//       }

//       // Dispatch user data to Redux store
//       dispatch(setUser({ uid, email: userEmail }));

//       toast.success("Login successful");

//       timeoutIdRef.current =  setTimeout(() => {
//         navigate(Path.Gallery);
//       }, 3000); // Delay of 3 seconds

//     } catch (err) {
//       //setError("Failed to login. Please check your credentials.");
//       toast.error(`${err}`);
//       //console.error("Login error:", err);
//     }
//   };

//   return (
//     <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
//       <div className="flex flex-col gap-16 w-[80%]">
//         <h2 className="text-3xl text-center font-bold py-8">Login</h2>
//         {/*{error && <p className="error">{error}</p>}*/}
//         <form className="flex flex-col gap-4" onSubmit={handleLogin}>
//           <div className="form-group relative">
//             <input
//               className="p-2 border-2 border-purple-200 w-full"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               required
//             />
//             <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
//           </div>
//           <div className="form-group relative">
//             <input
//               className="p-2 border-2 border-purple-200 w-full"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               required
//             />
//             <RiLockPasswordFill className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
//           </div>
//           <button
//             className="mt-8 p-2 font-bold border-2 border-[#e3fdf5] w-full"
//             type="submit"
//           >
//             Login
//           </button>
//         </form>
//         <p className="text-right">
//             If you don't have profile click <Link to={Path.Register}><span className="font-bold">here</span></Link>
//         </p>
//       </div>
//       <ToastContainer className="custom-toast-container" position="top-center"/>
//     </div>
//   );
// };

// export default Login;
