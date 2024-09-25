import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { ImageDataProps } from "../types/imageType";

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  //const [imageSize, setImageSize] = useState<string>('h-[400px]');

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchImages = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    //setLoading(true);

    try {
      // Prepare query
      let imagesQuery = query(
        collection(firestore, "images"),
        orderBy("createdAt", "desc"),
        limit(8)
      );

      if (lastVisible) {
        imagesQuery = query(imagesQuery, startAfter(lastVisible));
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
        const filteredNewImages = newImages.filter(
          (img) => !existingIds.has(img.id)
        );
        return [...prevImages, ...filteredNewImages];
      });

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Stop loading if we fetched less than requested, meaning no more images to load
      if (newImages.length < 8) {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(`${error}`);
      //console.error('Error fetching images:', error);
    } finally {
      setLoading(true);
      setIsFetching(false);
      setLoading(false);
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
          rootMargin: "200px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching, fetchImages]
  );

  return (
    <div className="flex flex-col items-center font-bold lg:w-[80%] sm:w-full sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)]">
      <div className="border-rainbow-gradient mb-4 w-full flex justify-center">
        <p className="pt-4 pb-2 px-2 font-kalam bg-rainbow-gradient bg-clip-text text-transparent text-4xl">
          Our Gallery
        </p>
      </div>
      <div className="p-1 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && <p>Loading...</p>}
        {!loading && images.length === 0 && <p>No images found.</p>}
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === images.length - 1 ? lastImageRef : null}
            className="border-2 h-[400px] transform transition-transform duration-500 ease-in-out hover:z-50 hover:scale-125"
          >
            <Link to={`/details/${image.id}`}>
              <img
                src={image.url}
                alt={image.title ?? "No Title"}
                className="object-cover w-full h-[90%] cursor-pointer"
              />
            </Link>
            <p className="p-2">{image.title ?? "No Title"}</p>
          </div>
        ))}
        {isFetching && <p>Loading more images...</p>}
        <ToastContainer
          className="custom-toast-container"
          position="top-center"
        />
      </div>
    </div>
  );
};

export default Gallery;
