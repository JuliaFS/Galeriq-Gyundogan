import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { ImageDataProps } from '../types/imageType';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageDataProps[]>([]);

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
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id}>
        <Link to={`/details/${image.id}`} key={image.id}>
          <img
            src={image.url}
            alt={image.title}
            className="object-cover w-full h-full cursor-pointer"
          />
        </Link>
        <p>{image.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;