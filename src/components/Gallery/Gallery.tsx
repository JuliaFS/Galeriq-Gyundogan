import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { ImageDataProps } from '../types/imageType';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null); // For tracking last document
  const [isLastPage, setIsLastPage] = useState<boolean>(false); // To check if last page is reached
  const [resetImages, setResetImages] = useState<boolean>(true); // To prevent duplication on reset

  const imagesPerPage = 8; // Number of images to display per page

  const fetchImages = async (startAfterDoc?: DocumentData) => {
    setLoading(true);

    try {
      const imagesQuery = startAfterDoc
        ? query(
            collection(firestore, 'images'),
            orderBy('createdAt', 'desc'),
            startAfter(startAfterDoc),
            limit(imagesPerPage)
          )
        : query(
            collection(firestore, 'images'),
            orderBy('createdAt', 'desc'),
            limit(imagesPerPage)
          );

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(imagesQuery);

      if (querySnapshot.docs.length < imagesPerPage) {
        setIsLastPage(true); // If fewer images than the limit are fetched, it's the last page
      }

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

      if (resetImages) {
        setImages(imagesList); // Reset the images array on initial load or refresh
        setResetImages(false); // Disable reset until necessary
      } else {
        setImages((prevImages) => [...prevImages, ...imagesList]); // Append new images
      }

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(); // Initial load
  }, []);

  const loadMoreImages = () => {
    if (!isLastPage && lastVisible) {
      fetchImages(lastVisible);
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-scroll">
        {loading && <p>Loading...</p>}
        {!loading && images.length === 0 && <p>No images found.</p>}
        {!loading && images.length > 0 && images.map((image) => (
          <div key={image.id} className="p-2">
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
      {!isLastPage && (
        <div className="flex justify-center mt-4">
          <button
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={loadMoreImages}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { collection, getDocs } from 'firebase/firestore';
// import { firestore } from '../../firebaseConfig';
// import { ImageDataProps } from '../types/imageType';

// const Gallery: React.FC = () => {
//   const [images, setImages] = useState<ImageDataProps[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(firestore, 'images'));
//         const imagesList = querySnapshot.docs.map((doc) => {
//           const data = doc.data();
          
//           return {
//             id: doc.id,
//             url: data.url,
//             title: data.title,
//             description: data.description,
//             category: data.category,
//             createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date if necessary
//           } as ImageDataProps;
//         });
//         setImages(imagesList);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       } finally {
//         setTimeout(() => {
//           setLoading(false); // Minimum loading time reached
//         }, 1000); // 1 second
//       }
//     };

//     fetchImages();

//   }, []);

//   return (
//     <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-scroll">
//       {loading && <p>Loading...</p>}
//       {!loading && images.length === 0 && <p>No images found.</p>}
//       {!loading && images.length > 0 && images.map((image) => (
//         <div key={image.id} className='p-2'>
//           <Link to={`/details/${image.id}`}>
//             <img
//               src={image.url}
//               alt={image.title ?? 'No Title'}
//               className="object-cover w-full h-full cursor-pointer"
//             />
//           </Link>
//           <p>{image.title ?? 'No Title'}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Gallery;
