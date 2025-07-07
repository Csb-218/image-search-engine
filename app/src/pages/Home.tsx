import { useState, useRef } from "react";
import { Link } from "react-router";
// import Dropzone from "react-dropzone";
// import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Dropzone from "../components/ImageUploader";
// import "./App.css";

interface Image {
  src: string;
  alt: string;
}

interface SearchResult {
  src: string;
  score: number;
}

const Home = () => {
  // const [images, setImages] = useState<Image[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState<boolean>(false);

  // const [page, setPage] = useState(1);
  //   const [indexing, setIndexing] = useState(false);
  //   const [indexSuccess, setIndexSuccess] = useState(false);
  const pageSize = 3;

  const colorScale = [
    "#00FF00", // green
    "#7FFF00", // chartreuse
    "#FFFF00", // yellow
    "#FFA500", // orange
    "#FF4500", // orange-red
    "#FF0000", // red
  ];

  // const fetchImages = useCallback(async () => {
  //   const response = await fetch(
  //     `${import.meta.env.VITE_HOST}/getImages?page=${page}&pageSize=${pageSize}`
  //   );
  //   const data: Image[] = await response.json();
  //   console.log(data);
  //   data.forEach(
  //     (image) => (image.src = `${import.meta.env.VITE_HOST}/${image.src}`)
  //   );
  //   setImages(data);
  // }, [page, pageSize]);

  // useEffect(() => {
  //   void fetchImages();
  // }, [page, pageSize, fetchImages]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);

      console.log(file);
      const formData = new FormData();

      formData.append("images", file);

      const response = await fetch(`${import.meta.env.VITE_HOST}/save`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        // const imageOrImages = acceptedFiles.length > 1 ? "Images" : "Image";

        setSearching(true);
        fetchResult(`${import.meta.env.VITE_HOST}/data/${file.name}`);
      }
    }
  };

  const handleDelete = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // const handleImageDrop = async (acceptedFiles: File[]) => {
  //   const formData = new FormData();
  //   acceptedFiles.forEach((file) => {
  //     formData.append("images", file);
  //   });

  //   const response = await fetch(
  //     `${import.meta.env.VITE_HOST}/uploadImages?pageSize=${pageSize}`,
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   );

  //   if (response.status === 200) {
  //     const { pageOfFirstImage } = await response.json();
  //     await fetchImages();
  //     setPage(pageOfFirstImage);
  //     const imageOrImages = acceptedFiles.length > 1 ? "Images" : "Image";
  //     toast.success(`${imageOrImages} uploaded successfully`);
  //   }
  // };

  // const handleIndexClick = async () => {
  //   setIndexing(true);
  //   const response = await fetch(`${import.meta.env.VITE_HOST}/indexImages`);
  //   setIndexing(false);
  //   if (response.status === 200) {
  //     setIndexSuccess(true);
  //   }
  // };

  // const handleDeleteConfirm = async () => {
  //   if (!selectedImage) return;

  //   const response = await fetch(
  //     `${import.meta.env.VITE_HOST}/deleteImage?imagePath=${encodeURIComponent(
  //       selectedImage
  //     )}`,
  //     { method: "DELETE" }
  //   );
  //   if (response.status === 200) {
  //     setSelectedImage(null);
  //     await fetchImages();
  //     toast.success("Image deleted successfully");
  //   }
  // };

  // const handleImageClick = async (imagePath: string) => {
  //   setSelectedImage(imagePath);
  //   console.log(imagePath)
  //   const response = await fetch(
  //     `${import.meta.env.VITE_HOST}/search?imagePath=${encodeURIComponent(
  //       imagePath
  //     )}`
  //   );
  //   const matchingImages: SearchResult[] = await response.json();
  //   matchingImages.forEach(
  //     (image) => (image.src = `${import.meta.env.VITE_HOST}/${image.src}`)
  //   );
  //   setSearchResults(matchingImages);
  // };

  async function fetchResult(imagePath: string) {
    // setSelectedImage(images[0].src);
    const response = await fetch(
      `${import.meta.env.VITE_HOST}/search?imagePath=${encodeURIComponent(
        imagePath
      )}&upload=${false}`
    );
    const matchingImages: SearchResult[] = await response.json();
    matchingImages.forEach(
      (image) => (image.src = `${import.meta.env.VITE_HOST}/${image.src}`)
    );
    setSearchResults(matchingImages);
    setSearching(false);
  }

  // useEffect(()=>{

  //   async function fetchResult(){
  //     setSelectedImage(images[0].src);
  //     const response = await fetch(
  //     `${import.meta.env.VITE_HOST}/search?imagePath=${encodeURIComponent(
  //       images[0].src
  //     )}`
  //   );
  //   const matchingImages: SearchResult[] = await response.json();
  //   matchingImages.forEach(
  //     (image) => (image.src = `${import.meta.env.VITE_HOST}/${image.src}`)
  //   );
  //   setSearchResults(matchingImages);
  //   }

  //   if(preview ) fetchResult()

  // },[preview])

  console.log("searchResults: ", searchResults);

  return (
    <div className="min-h-screen w-full text-center mt-10">
      <h1 className="text-4xl">Image Search</h1>
      <p>or</p>

      <Link to={"/upload"}>
        <button className="inline-flex items-center justify-center h-8 gap-2 px-4 text-xs font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
          upload image
        </button>
      </Link>

      <Dropzone
        handleChange={handleChange}
        handleDelete={handleDelete}
        preview={preview}
        loading={loading}
        upload={false}
      />
      {/* <div className="p-5 flex gap-4 items-center">
            <button
              onClick={handleIndexClick}
              className={`${
                indexSuccess ? "bg-green-500" : "bg-blue-400"
              } py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none`}
            >
              Index
            </button>
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button
                  className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:bg-red-500"
                  disabled={selectedImage === null}
                >
                  Delete
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-gray-800/80 data-[state=open]:animate-overlayShow fixed inset-0" />
                <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <AlertDialog.Title className="text-gray-800 m-0 text-[17px] font-medium">
                    Are you sure?
                  </AlertDialog.Title>
                  <AlertDialog.Description className="text-gray-700 mt-4 mb-5 text-[15px] leading-normal">
                    This action will permanently delete{" "}
                    <span className="font-medium break-all">"{selectedImage}"</span>{" "}
                    from the index and filesystem.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-[25px]">
                    <AlertDialog.Cancel asChild>
                      <button className="text-gray-100 bg-gray-500 hover:bg-gray-700 focus:shadow-gray-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                        Cancel
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button
                        className="text-red-100 bg-red-500 hover:bg-red-700 focus:shadow-red-700 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                        onClick={handleDeleteConfirm}
                      >
                        Yes, delete
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div> */}

      {/* {indexing && (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )} */}

      {/* <div className="grid grid-cols-3 gap-4 p-5">
            {images.map((image, index) => (
              <div
                key={index}
                className={`w-full h-64 bg-gray-600 rounded-md flex items-center justify-center ${
                  image.src === selectedImage ? "border-4 border-blue-500" : ""
                }`}
                onClick={() => handleImageClick(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className=" h-4/5  aspect-square object-cover"
                />
              </div>
            ))}
          </div> */}

      {/* <div className="flex justify-center p-5">
            <button
              className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none mr-4"
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            >
              Previous
            </button>
            <button
              className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none"
              onClick={() => setPage((prevPage) => prevPage + 1)}
            >
              Next
            </button>
          </div> */}
      {searching && (
        <>
          <div className="flex flex-col items-center text-center">
            Searching ...
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-labelledby="title-04a desc-04a"
              aria-live="polite"
              aria-busy="true"
              className="w-10 h-10 animate animate-spin"
            >
              <title id="title-04a">Icon title</title>
              <desc id="desc-04a">Some desc</desc>
              <circle
                cx="12"
                cy="12"
                r="10"
                className="stroke-slate-200"
                stroke-width="4"
              />
              <path
                d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
                className="stroke-emerald-500"
                stroke-width="4"
              />
            </svg>
          </div>
        </>
      )}

      {!searching && (
        <div className="grid grid-cols-3 gap-4 p-5">
          {searchResults.map((result, index) => (
            <a
              key={index}
              href="https://jainbutton.m.erpnext.com/app/item?disabled=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                aria-label="image-holder"
                className="w-full h-64  rounded-md flex flex-col items-center justify-center my-2 overflow-hidden"
              >
                <img
                  src={result.src}
                  alt="Search result"
                  style={{
                    backgroundColor: `${colorScale[index]}`,
                  }}
                  className={`h-4/5 aspect-square object-cover p-1 rounded`}
                />
                {/* <p className="w-full text-center bg-blue-500 text-white">
                  Score: {result.score}
                </p> */}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
