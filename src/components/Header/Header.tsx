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
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const handleClick = () => setNav(!nav);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setNav(false);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      dispatch(clearUser()); // Clears user data from Redux state 
     handleLinkClick();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div className="p-4 whitespace-nowrap">
        <Link to={Path.Home} onClick={handleLinkClick}>Gallery Gyundogan</Link>
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
            <Link to={Path.Home} onClick={handleLinkClick}>Home</Link>
          </li>
          <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
            <Link to={Path.Gallery} onClick={handleLinkClick}>Gallery</Link>
          </li>

          {user.email !== null ? (
            <>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
              <Link to={Path.CreatePicture} onClick={handleLinkClick}>Create picture</Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                Hello, {user.email}
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
                <Link to={Path.Login} onClick={handleLinkClick}>Login</Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.Register} onClick={handleLinkClick}>Register</Link>
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
            <IoClose size={30} />
          ) : (
            <GiHamburgerMenu size={30} />
        )}
      </div>
    </>
  );
}
