import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

import { ImageDataProps } from '../types/imageType';
import { selectUser } from '../../store/userSlice';
import { useSelector } from 'react-redux';
import { Path } from '../../constants/constants';
import { pathToUrl } from '../../utils/pathToUrl';
//import ConfirmationModal from '../components/ConfirmationModal'; // Import the modal component
import ConfirmationModal from '../Modal/ConfirmationModal';

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
        const docRef = doc(firestore, 'images', pictureId);
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
        await deleteDoc(doc(firestore, 'images', pictureId));
        toast.success("Image deleted successfully!");
        navigate(Path.Gallery); // Redirect to the gallery after deletion
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete the image");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-auto">
      {loading && <p>Loading...</p>}
      {imageData && !loading && (
        <div>
          <img src={imageData.url} alt={imageData.title ?? 'Image'} className="image-details-img" />
          <h1>{imageData.title ?? 'No Title'}</h1>
          <p>{imageData.author ?? 'No Author'}</p>
          <p>{imageData.description ?? 'No Description'}</p>
          <p>Category: {imageData.category ?? 'No Category'}</p>
          <p>Created At: {imageData.createdAt ? imageData.createdAt.toDate().toLocaleDateString() : 'Unknown'}</p>
        </div>
      )}
      {user.uid === imageData?.userUid && (
        <div>
          <button className="mt-4 p-2 font-bold border-2 border-[#e3fdf5] w-full">
            <Link to={pathToUrl(Path.PictureEdit, { pictureId })}>Edit</Link>
          </button>
          <button
            className="mt-4 p-2 font-bold border-2 border-[#e3fdf5] w-full"
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
      <ToastContainer className="custom-toast-container" position="top-center" />
    </div>
  );
};

export default ImageDetails;
