import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { ImageDataProps } from '../types/imageType';

// Define the ImageDataProps interface with all necessary field

const ImageDetails: React.FC = () => {
  const { pictureId } = useParams<{ pictureId: string }>();
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!pictureId) {
        setError('No ID provided');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, 'images', pictureId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setImageData(docSnap.data() as ImageDataProps); // Type assertion
        } else {
          setError('No such document!');
        }
      } catch (error) {
        setError('Failed to fetch image details');
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [pictureId]);

  // Render loading state, error state, and image data
  return (
    <div className="image-details-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {imageData && !loading && !error && (
        <div>
          <img src={imageData.url} alt={imageData.title ?? 'Image'} className="image-details-img" />
          <h1>{imageData.title ?? 'No Title'}</h1>
          <p>{imageData.author ?? 'No Author'}</p>
          <p>{imageData.description ?? 'No Description'}</p>
          <p>Category: {imageData.category ?? 'No Category'}</p>
          <p>Created At: {imageData.createdAt ? imageData.createdAt.toDate().toLocaleDateString() : 'Unknown'}</p>
        </div>
      )}
    </div>
  );
};

export default ImageDetails;