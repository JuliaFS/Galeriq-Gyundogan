import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { storage, firestore } from "../../firebaseConfig";

const UploadImage: React.FC = () => {
  const [formData, setFormData] = useState({
    image: null as File | null,
    title: "",
    description: "",
    category: "",
  });
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if the input type is file
    if (e.target.type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setFormData((prev) => ({
          ...prev,
          [name]: files[0], // Only assign the first file
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Handle text inputs and textareas
      }));
    }
  };
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (
      formData.image &&
      formData.title &&
      formData.description &&
      formData.category
    ) {
      const storageRef = ref(storage, `images/${formData.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);

          try {
            await addDoc(collection(firestore, "images"), {
              url: downloadURL,
              title: formData.title,
              description: formData.description,
              category: formData.category,
              createdAt: new Date(),
            });
            console.log("Document successfully written!");
          } catch (error) {
            setError("rror writing document.");
            console.error("Error writing document: ", error);
          }
        }
      );
    } else {
      console.log("Please fill in all fields.");
    }
  };

  return (
    <div className="bg-custom-gradient flex justify-center relative z-10 h-[30rem] w-[25rem] shadow-custom-shadow">
      <div className="flex flex-col gap-8 w-[80%]">
        <h2 className="text-3xl text-center font-bold py-4">Create picture</h2>
        {error && <p className="error">{error}</p>}
        <form className="flex flex-col gap-2" onSubmit={handleUpload}>
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
              required
            />
          </div>

          <button
            className="mt-8 p-2 font-bold border-2 border-[#e3fdf5] w-full"
            type="submit"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;

// import React, { useState } from 'react';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../firebaseConfig';

// const UploadImage: React.FC = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [progress, setProgress] = useState<number>(0);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleUpload = () => {
//     if (image) {
//       const storageRef = ref(storage, `images/${image.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, image);

//       uploadTask.on(
//         'state_changed',
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setProgress(progress);
//           console.log('Upload is ' + progress + '% done');
//         },
//         (error) => {
//           console.error('Upload failed', error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             console.log('File available at:', downloadURL);
//             // Optionally, you can store the download URL in Firestore or another database
//           });
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       {progress > 0 && <p>Upload progress: {progress.toFixed(2)}%</p>}
//     </div>
//   );
// };

// export default UploadImage;
