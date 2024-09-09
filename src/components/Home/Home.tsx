import React, { useEffect, useState } from "react";
import { fetchLast8Pictures } from "../../services/firestoreService";
import { ImageDataProps } from "../types/imageType";
import InfiniteCarousel from "./InfiniteCarusel";

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
    <div className="w-full sm:h-[calc(100vh-172px)] lg:h-[calc(100vh-112px)] flex flex-col">
      <div className="bg-yellow-200 flex-1 grid sm:grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] grid-rows-[auto_1fr]">
        {/* First Column */}
        <div className="bg-green-500 flex items-center justify-center">
          <p className="rotate-[-90deg] bg-white w-[80%] text-center p-4">Our latest pictures</p>
        </div>

        {/* Second Column */}
        <div className="h-auto">
          {/* Row 1: Image Gallery */}
          <div className="gallery bg-orange-200 h-full flex justify-center items-center overflow-hidden">
            {pictures.length === 0 ? (
              <p>No pictures found.</p>
            ) : (
              pictures.map((picture) => (
                <img
                  key={picture.url}
                  src={picture.url}
                  alt={`Image ${picture.title}`}
                  className="h-full object-cover"
                />
              ))
            )}
          </div>
        </div>
        {/* Row 2: Additional Content */}
        <div className="bg-pink-500 flex justify-center items-center">
          <p>Content here</p>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="bg-pink-200 h-[30%]">
        {pictures.length === 0 ? (
          <p>No pictures found.</p>
        ) : (
          <div
            className="relative h-full w-auto py-[20px] flex overflow-hidden whitespace-nowrap
            before:absolute before:top-0 before:left-0 before:w-[3%] before:h-full before:bg-custom-gradient-toLeft before:content-[''] before:z-10
            after:absolute after:top-0 after:right-0 after:w-[3%] after:h-full after:bg-custom-gradient-toRight after:content-[''] after:z-10"
          >
            <div className="w-auto h-full animate-scroll flex-shrink-0 whitespace-nowrap">
              {pictures.map((picture) => (
                <img
                  key={picture.url}
                  src={picture.url}
                  alt={`Image ${picture.title}`}
                  className="h-full inline-block px-[20px] object-contain"
                />
              ))}
            </div>
            <div className="w-auto h-full animate-scroll flex-shrink-0 whitespace-nowrap">
              {/* Duplicate the same images for the seamless transition */}
              {pictures.map((picture) => (
                <img
                  key={`${picture.url}-duplicate`}
                  src={picture.url}
                  alt={`Image ${picture.title}`}
                  className="h-full inline-block px-[20px] object-contain"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
