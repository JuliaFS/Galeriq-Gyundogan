import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getAuth, signOut } from "firebase/auth";

import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

import { clearUser, selectUser } from "../../store/userSlice";
import { Path } from "../../constants/constants";

export default function Header() {
  const [nav, setNav] = useState(false);
  const userEmail = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleClick = () => setNav(!nav);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      dispatch(clearUser()); // Clears user data from Redux state
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div className="p-4 whitespace-nowrap">
        <Link to={Path.Home}>Gallery Gyundogan</Link>
      </div>
      <nav className="lg:static lg:flex-grow lg:p-4">
        <ul
          className={
            nav
              ? "bg-purple-200 sm:absolute sm:w-full transition duration-1000 ease-in"
              : "sm:hidden lg:flex lg:flex-row lg:justify-end lg:gap-4"
          }
        >
          <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
            <Link to={Path.Home}>Home</Link>
          </li>
          <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
            <Link to={Path.Home}>Gallery</Link>
          </li>

          {userEmail ? (
            <>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
              <Link to={Path.CreatePicture}>Create picture</Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                Hello, {userEmail}
              </li>
              <li
                className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0"
                onClick={handleLogout}
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.Login}>Login</Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.Register}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* Hamburger or Close Icon */}
      <div
        className="absolute top-2 right-1 text-white sm:block lg:hidden"
        onClick={handleClick}
      >
        {nav ? (
          <div
            className="cursor-pointer pr-4 sm:block lg:hidden"
            onClick={handleClick}
          >
            <IoClose size={30} />
          </div>
        ) : (
          <div
            className="cursor-pointer pr-4 sm:block lg:hidden"
            onClick={handleClick}
          >
            <GiHamburgerMenu size={30} />
          </div>
        )}
      </div>
    </>
  );
}
