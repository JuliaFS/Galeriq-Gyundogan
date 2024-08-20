import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { ImageDataProps } from '../types/imageType';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'images'));
        const imagesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          return {
            id: doc.id,
            url: data.url,
            title: data.title,
            description: data.description,
            category: data.category,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date if necessary
          } as ImageDataProps;
        });
        setImages(imagesList);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setTimeout(() => {
          setLoading(false); // Minimum loading time reached
        }, 1000); // 1 second
      }
    };

    fetchImages();

  }, []);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-scroll">
      {loading && <p>Loading...</p>}
      {!loading && images.length === 0 && <p>No images found.</p>}
      {!loading && images.length > 0 && images.map((image) => (
        <div key={image.id} className='p-2'>
          <Link to={`/details/${image.id}`}>
            <img
              src={image.url}
              alt={image.title ?? 'No Title'}
              className="object-cover w-full h-full cursor-pointer"
            />
          </Link>
          <p>{image.title ?? 'No Title'}</p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
