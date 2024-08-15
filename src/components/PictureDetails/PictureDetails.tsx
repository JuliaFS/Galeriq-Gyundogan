import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

import { ImageDataProps } from '../types/imageType';
import { selectUser } from '../../store/userSlice';
import { useSelector } from 'react-redux';

// Define the ImageDataProps interface with all necessary field

const ImageDetails: React.FC = () => {
  const { pictureId } = useParams<{ pictureId: string }>();
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector(selectUser);
 // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!pictureId) {
       // setError('No ID provided');
       toast.error("No ID provided.")
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, 'images', pictureId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImageData(docSnap.data() as ImageDataProps); // Type assertion
        } else {
          //setError('No such document!');
          toast.error("No such document!")
        }
      } catch (error) {
        //setError('Failed to fetch image details');
        toast.error("Failed to fetch image details");
        //console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [pictureId]);
  console.log(imageData)
  // Render loading state, error state, and image data
  return (
    <div className="image-details-container">
      {loading && <p>Loading...</p>}
      {/*{error && <p className="error-message">{error}</p>}*/}
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
      { user.uid === imageData?.userUid &&
        <div>
            <button className="mt-4 p-2 font-bold border-2 border-[#e3fdf5] w-full">Edit</button>
            <button className="mt-4 p-2 font-bold border-2 border-[#e3fdf5] w-full">Delete</button>
        </div>
      }
      <ToastContainer className="custom-toast-container" position="top-center"/>
    </div>
  );
};

export default ImageDetails;