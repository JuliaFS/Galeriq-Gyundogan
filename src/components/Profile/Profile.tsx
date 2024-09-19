import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { selectUser, setUser } from "../../store/userSlice"; // Ensure correct path
import {
  updateUserProfile,
  uploadProfileImage,
} from "../../services/authService"; // Ensure these are implemented

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // Access user data from Redux store

  // Initialize state with user data
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [rePass, setRePass] = useState("");
  const [address, setAddress] = useState(user.address || "");
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined); // State for profile image
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    user.profileImageUrl
  ); // State for profile image URL
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user.uid) {
      navigate("/login"); // Redirect to login if no user data
    }
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUpdating(true);

    if (password !== rePass) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      let newProfileImageUrl = profileImageUrl;

      // Upload profile image if selected
      if (profileImage) {
        newProfileImageUrl = await uploadProfileImage(user.uid, profileImage);
        setProfileImageUrl(newProfileImageUrl); // Update state with the new image URL
      }

      // Update user profile in Firestore
      await updateUserProfile(
        user.uid,
        displayName,
        email,
        password,
        address,
        profileImage
      );

      // Update user in Redux store
      dispatch(
        setUser({
          uid: user.uid,
          email,
          displayName,
          address,
          profileImageUrl: newProfileImageUrl || "",
        })
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      setIsUpdating(false);
      toast.error(`Failed to update profile. ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="z-10 mt-8 sm:h-[calc(100vh-172px)] align-middle lg:h-[calc(100vh-112px)] sm:w-full lg:w-[50rem]">
      <div className="flex sm:flex-col md:flex-row items-center lg:border-2 relative">
        <div className="flex flex-col gap-10 items-center sm:w-full md:w-[50%] lg:border-r-0 sm:mb-4">
          <div className="lg:p-8">
            <img
              src={profileImageUrl || "fallback-image-url"} // Use a fallback image URL if none is provided
              alt={displayName || "Profile image"}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">
              Display Name: 
              <span className="font-bold"> {displayName || "User"}</span>
            </p>
            <p>
              Email: <span className="font-bold">{email}</span>
            </p>
            <p>
              Address: <span className="font-bold">{address}</span>
            </p>
          </div>
        </div>

        <div className="bg-custom-gradient shadow-custom-shadow flex flex-col justify-center items-center gap-10 sm:w-[80%] md:w-[50%] md:mr-8 lg:mr-0">
          <div className="flex flex-col gap-4 w-[70%]">
            <h2 className="text-3xl text-center font-bold py-8">Profile</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleUpdateProfile}
            >
              <div className="form-group relative">
                <input
                  className="p-2 border-2 border-purple-200 w-full"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  required
                  disabled={isUpdating}
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
                  disabled
                />
                <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
              </div>
              <div className="form-group relative">
                <input
                  className="p-2 border-2 border-purple-200 w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  disabled={isUpdating}
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
                  disabled={isUpdating}
                />
                <RiLockPasswordFill className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
              </div>
              <div className="form-group relative">
                <input
                  className="p-2 border-2 border-purple-200 w-full"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  disabled={isUpdating}
                />
                <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
              </div>
              <div className="form-group relative">
                <input
                  className="p-2 border-2 border-purple-200 w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileImage(
                      e.target.files ? e.target.files[0] : undefined
                    )
                  }
                  disabled={isUpdating}
                />
                <FaUserEdit className="absolute right-2.5 top-2.5 text-purple-200 text-xl" />
              </div>
              <button
                className="mt-8 p-2 font-bold border-2 border-[#e3fdf5] w-full"
                type="submit"
              >
                Update Profile
              </button>
            </form>
          </div>
          <ToastContainer
            className="custom-toast-container"
            position="top-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
