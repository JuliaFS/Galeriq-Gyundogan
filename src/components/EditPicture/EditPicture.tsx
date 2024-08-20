import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../../firebaseConfig";
import { selectUser } from "../../store/userSlice";
import { Path } from "../../constants/constants";

const EditImage: React.FC = () => {
    const { pictureId } = useParams<{ pictureId: string }>();
  const [formData, setFormData] = useState({
    image: null as File | null,
    title: "",
    author: "",
    description: "",
    category: "",
    url: "",
    userUid: ""
  });
  const [progress, setProgress] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  if (!pictureId) {
    throw new Error("pictureId is missing from the URL");
  }

  // Fetch existing image data
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const docRef = doc(firestore, "images", pictureId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            image: null,
            title: data.title,
            author: data.author,
            description: data.description,
            category: data.category,
            url: data.url, // Existing image URL
            userUid: data.userUid,
          });

          // Check if the current user is the creator
          setIsAuthorized(data.userUid === user.uid);
        } else {
          toast.error("Image not found.");
        }
      } catch (error) {
        toast.error(`Error fetching image: ${error}`);
      }
    };

    fetchImageData();
  }, [pictureId, user.uid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setFormData((prev) => ({
          ...prev,
          image: files[0], // Update the selected image file
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast.error("You are not authorized to edit this image.");
      return;
    }

    setIsUpdating(true);

    const updateImageMetadata = async (imageUrl: string) => {
      const docRef = doc(firestore, "images", pictureId);
      await updateDoc(docRef, {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        category: formData.category,
        url: imageUrl, // Update the image URL if a new image is uploaded
        updatedAt: new Date(),
      });
      toast.success("Image successfully updated!");

      setTimeout(() => {
        setIsUpdating(false);
        navigate(Path.Gallery);
      }, 2000);
    };

    // If a new image is selected, upload it first
    if (formData.image) {
      const storageRef = ref(storage, `images/${formData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          toast.error(`${error}`);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateImageMetadata(downloadURL);
        }
      );
    } else {
      // If no new image is selected, just update the metadata
      await updateImageMetadata(formData.url);
    }
  };

  if (!isAuthorized) {
    return <p>You are not authorized to edit this picture.</p>;
  }

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-4 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-4">Edit Picture</h2>
        <form className="flex flex-col gap-2" onSubmit={handleUpdate}>
          <input type="file" name="image" onChange={handleInputChange} />
          {progress > 0 && <p>Upload progress: {progress.toFixed(2)}%</p>}
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="text"
              name="title"
              placeholder="Enter image title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="form-group relative">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="text"
              name="author"
              placeholder="Author name"
              value={formData.author}
              onChange={handleInputChange}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="form-group relative">
            <textarea
              className="p-2 border-2 border-purple-200 w-full h-[5rem]"
              name="description"
              placeholder="Enter image description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="form-group relative p-0">
            <input
              className="p-2 border-2 border-purple-200 w-full"
              type="text"
              name="category"
              placeholder="Enter image category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isUpdating}
              required
            />
          </div>

          <button
            className="mt-4 p-2 font-bold border-2 border-[#e3fdf5] w-full"
            type="submit"
            disabled={isUpdating}
          >
            Update Picture
          </button>
        </form>
      </div>
      <ToastContainer className="custom-toast-container" position="top-center"/>
    </div>
  );
};

export default EditImage;


