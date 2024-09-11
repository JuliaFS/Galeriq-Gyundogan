import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

import { ImageDataProps } from "../types/imageType";
import { selectUser } from "../../store/userSlice";
import { useSelector } from "react-redux";
import { Path } from "../../constants/constants";
import { pathToUrl } from "../../utils/pathToUrl";
//import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal component
import ConfirmationModal from "../Modal/ConfirmationModal";

const ImageDetails: React.FC = () => {
  const { pictureId } = useParams<{ pictureId: string }>();
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  if (!pictureId) {
    throw new Error("pictureId is missing from the URL");
  }

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!pictureId) {
        toast.error("No ID provided.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, "images", pictureId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImageData(docSnap.data() as ImageDataProps);
        } else {
          toast.error("No such document!");
        }
      } catch (error) {
        toast.error("Failed to fetch image details");
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [pictureId]);

  const handleDelete = async () => {
    try {
      if (pictureId) {
        await deleteDoc(doc(firestore, "images", pictureId));
        toast.success("Image deleted successfully!");
        navigate(Path.Gallery); // Redirect to the gallery after deletion
      }
    } catch (error) {
      //console.error("Error deleting image:", error);
      toast.error("Failed to delete the image");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col sm:h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)] sm:w-full lg:w-[70%] sm:p-4 lg:p-0 md:items-center lg:items-start">
      {loading && <p>Loading...</p>}
      {imageData && !loading && (
        <div className="h-fit">
          <div className="text-center text-3xl py-2 mt-[2rem] font-bold border-rainbow-gradient">
            <h1 className="p-2">{imageData.title ?? "No Title"}</h1>
          </div>
          <div className="py-4 my-2 grid lg:grid-cols-2 h-auto">
            <div>
              <img
                src={imageData.url}
                alt={imageData.title ?? "Image"}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="p-2">
              <p className="lg:p-2">
                Author:{" "}
                <span className="font-bold">
                  {imageData.author ?? "No Author"}
                </span>
              </p>
              <p className="lg:p-2">
                {imageData.description ?? "No Description"}
              </p>
              <p className="lg:p-2">
                Category: {imageData.category ?? "No Category"}
              </p>
              <p className="lg:p-2">
                Created At:{" "}
                {imageData.createdAt
                  ? imageData.createdAt.toDate().toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
      {user.uid === imageData?.userUid && (
        <div className="flex gap-2 md:w-[60%] lg:w-[40%]">
          <button className="mt-4 mb-4 p-2 font-bold border-2 border-[#e3fdf5] w-full">
            <Link to={pathToUrl(Path.PictureEdit, { pictureId })}>Edit</Link>
          </button>
          <button
            className="mt-4 mb-4 p-2 font-bold border-2 border-[#e3fdf5] w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Delete
          </button>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this image?"
      />
      <ToastContainer
        className="custom-toast-container"
        position="top-center"
      />
    </div>
  );
};

export default ImageDetails;
