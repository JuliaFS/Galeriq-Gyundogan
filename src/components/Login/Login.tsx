import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../services/authService";
import { getUserData, saveUserData } from "../../services/firestoreService";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { Link } from "react-router-dom";
import { Path } from "../../constants/constants";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const userCredential = await authenticateUser(email, password);
      const userId = userCredential.user.uid;
      const userEmail = userCredential.user.email;

      // Fetch or create user data in Firestore
      let userData = await getUserData(userId);
      if (!userData) {
        userData = { email: userCredential.user.email! };
        await saveUserData(userId, userData);
      }

      if (userEmail) {
        dispatch(setUser(userEmail));
      }
      navigate(Path.Gallery);

      setError(null);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-16 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-8">Login</h2>
        {error && <p className="error">{error}</p>}
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
            If you don't have profile click <Link to={Path.Register}><span className="font-bold">here</span></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
