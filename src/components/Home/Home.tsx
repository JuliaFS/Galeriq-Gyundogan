import React, { useEffect, useState } from 'react';
import { fetchLast8Pictures} from '../../services/firestoreService';
import { ImageDataProps } from '../types/imageType';

// React component to display the images
const Home: React.FC = () => {
  const [pictures, setPictures] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPictures = async () => {
      try {
        const fetchedPictures = await fetchLast8Pictures();
        setPictures(fetchedPictures);
      } catch (error) {
        console.error("Error loading pictures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPictures();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-scroll">
      {pictures.length === 0 ? (
        <p>No pictures found.</p>
      ) : (
        pictures.map(picture => (
          <div key={picture.id}>
            <img src={picture.url} alt={`Image ${picture.id}`} />
          </div>
        ))
      )}
    </div>
  );
};

export default Home;