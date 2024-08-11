import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'images'));
      const imagesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesList);
    };

    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <Link to={`/details/${image.id}`} key={image.id}>
          <img
            src={image.url}
            alt={image.title}
            className="object-cover w-full h-full cursor-pointer"
          />
        </Link>
      ))}
    </div>
  );
};

export default Gallery;