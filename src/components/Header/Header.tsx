import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getAuth, signOut } from "firebase/auth";

import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

import { clearUser, selectUser } from "../../store/userSlice";
import { Path } from "../../constants/constants";

export default function Header() {
  const [nav, setNav] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  console.log({ user });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User in Header (after useEffect):", user);
  }, [user]); // This will log user state whenever it changes

  // if (!user || !user.email) {
  //   return null; // Or return a loading spinner if you prefer
  // }
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
      navigate(Path.Home);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <div className="p-4 whitespace-nowrap">
        <Link to={Path.Home} onClick={handleLinkClick} className="font-kalam bg-rainbow-gradient bg-clip-text text-transparent text-2xl">
          Gallery Gyundogan
        </Link>
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
            <Link to={Path.Home} onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
            <Link to={Path.Gallery} onClick={handleLinkClick}>
              Gallery
            </Link>
          </li>

          {user.email ? (
            <>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.CreatePicture} onClick={handleLinkClick}>
                  Create picture
                </Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                Hello, {user.email}
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.UserProfile}>User Profile</Link>
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
                <Link to={Path.Login} onClick={handleLinkClick}>
                  Login
                </Link>
              </li>
              <li className="border-b-[1px] border-white lg:border-none sm:p-2 lg:p-0">
                <Link to={Path.Register} onClick={handleLinkClick}>
                  Register
                </Link>
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
        {nav ? <IoClose size={30} /> : <GiHamburgerMenu size={30} />}
      </div>
    </>
  );
}
