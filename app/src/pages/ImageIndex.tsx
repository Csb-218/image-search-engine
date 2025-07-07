import React, { useState, useRef } from "react";
import {Link} from "react-router"
import Dropzone from "../components/ImageUploader";
import { toast, Toaster } from "sonner";

const ImageIndex: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    const files = e.target.files;

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_HOST}/uploadImages`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 200) {
        //   const { pageOfFirstImage } = await response.json();
        //   await fetchImages();
        //   setPage(pageOfFirstImage);
        const imageOrImages = files.length > 1 ? "Images" : "Image";
        toast.success(`${imageOrImages} uploaded successfully`);
        setLoading(false);
      }
    }
  };

  const handleDelete = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <>
    <main className='flex flex-col items-center w-full justify-center mt-10 text-center'>
        <Toaster />
      <h1 className="text-4xl">Upload Images</h1>
      <Link to={'/'}>
      <p>
        or
      </p>
      <button className="inline-flex items-center justify-center h-8 gap-2 px-4 text-xs font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
          search image
        </button>
      </Link>
      <Dropzone
        handleChange={handleChange}
        handleDelete={handleDelete}
        preview={preview}
        loading={loading}
        upload={true}
      />

      

     
    </main>
      
    </>
  );
};

export default ImageIndex;
