import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { ImageDataProps } from '../types/imageType';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchImages = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    setLoading(true);

    try {
      // Prepare query
      let imagesQuery = query(
        collection(firestore, 'images'),
        orderBy('createdAt', 'desc'),
        limit(8)
      );

      if (lastVisible) {
        imagesQuery = query(
          imagesQuery,
          startAfter(lastVisible)
        );
      }

      // Fetch images
      const querySnapshot = await getDocs(imagesQuery);
      if (querySnapshot.empty) {
        setHasMore(false);
        return;
      }

      const newImages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.url,
          title: data.title,
          description: data.description,
          category: data.category,
          createdAt: data.createdAt.toDate(),
        } as ImageDataProps;
      });

      // Prevent duplication
      setImages((prevImages) => {
        const existingIds = new Set(prevImages.map((img) => img.id));
        const filteredNewImages = newImages.filter((img) => !existingIds.has(img.id));
        return [...prevImages, ...filteredNewImages];
      });

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Stop loading if we fetched less than requested, meaning no more images to load
      if (newImages.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(`${error}`)
      //console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [lastVisible, hasMore, isFetching]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const lastImageRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchImages();
          }
        },
        {
          rootMargin: '200px',
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching, fetchImages]
  );

  return (
    <div className="p-1 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] overflow-y-scroll">
      {loading && <p>Loading...</p>}
      {!loading && images.length === 0 && <p>No images found.</p>}
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={index === images.length - 1 ? lastImageRef : null}
          className="border-2"
        >
          <Link to={`/details/${image.id}`}>
            <img
              src={image.url}
              alt={image.title ?? 'No Title'}
              className="object-cover w-full h-[90%] cursor-pointer"
            />
          </Link>
          <p className="p-2">{image.title ?? 'No Title'}</p>
        </div>
      ))}
      {isFetching && <p>Loading more images...</p>}
      <ToastContainer className="custom-toast-container" position="top-center" />
    </div>
  );
};

export default Gallery;



// Example with Load more button

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QuerySnapshot } from 'firebase/firestore';
// import { firestore } from '../../firebaseConfig';
// import { ImageDataProps } from '../types/imageType';

// const Gallery: React.FC = () => {
//   const [images, setImages] = useState<ImageDataProps[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null); // For tracking last document
//   const [isLastPage, setIsLastPage] = useState<boolean>(false); // To check if last page is reached
//   const [resetImages, setResetImages] = useState<boolean>(true); // To prevent duplication on reset

//   const imagesPerPage = 8; // Number of images to display per page

//   const fetchImages = async (startAfterDoc?: DocumentData) => {
//     setLoading(true);

//     try {
//       const imagesQuery = startAfterDoc
//         ? query(
//             collection(firestore, 'images'),
//             orderBy('createdAt', 'desc'),
//             startAfter(startAfterDoc),
//             limit(imagesPerPage)
//           )
//         : query(
//             collection(firestore, 'images'),
//             orderBy('createdAt', 'desc'),
//             limit(imagesPerPage)
//           );

//       const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(imagesQuery);

//       if (querySnapshot.docs.length < imagesPerPage) {
//         setIsLastPage(true); // If fewer images than the limit are fetched, it's the last page
//       }

//       const imagesList = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           url: data.url,
//           title: data.title,
//           description: data.description,
//           category: data.category,
//           createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date if necessary
//         } as ImageDataProps;
//       });

//       if (resetImages) {
//         setImages(imagesList); // Reset the images array on initial load or refresh
//         setResetImages(false); // Disable reset until necessary
//       } else {
//         setImages((prevImages) => [...prevImages, ...imagesList]); // Append new images
//       }

//       setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchImages(); // Initial load
//   }, []);

//   const loadMoreImages = () => {
//     if (!isLastPage && lastVisible) {
//       fetchImages(lastVisible);
//     }
//   };

//   return (
//     <div>
//       <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-152px)] overflow-y-scroll">
//         {loading && <p>Loading...</p>}
//         {!loading && images.length === 0 && <p>No images found.</p>}
//         {!loading && images.length > 0 && images.map((image) => (
//           <div key={image.id} className="p-2">
//             <Link to={`/details/${image.id}`}>
//               <img
//                 src={image.url}
//                 alt={image.title ?? 'No Title'}
//                 className="object-cover w-full h-full cursor-pointer"
//               />
//             </Link>
//             <p>{image.title ?? 'No Title'}</p>
//           </div>
//         ))}
//       </div>
//       {!isLastPage && (
//         <div className="flex justify-center mt-4">
//           <button
//             className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             onClick={loadMoreImages}
//             disabled={loading}
//           >
//             {loading ? 'Loading...' : 'Load More'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Gallery;

