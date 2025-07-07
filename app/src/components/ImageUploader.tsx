import React, { useRef } from "react";

interface DropzoneProps {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleDelete: () => void;
  preview: string | null;
  loading: boolean;
  upload: boolean;
}

export default function Dropzone({
  handleChange,
  handleDelete,
  preview,
  loading,
  upload,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="relative my-6 flex justify-center w-full">
        <input
          id="id-dropzone02"
          name="file-upload"
          type="file"
          className="peer hidden"
          accept=".jpg,.png,.jpeg"
          multiple={upload}
          ref={inputRef}
          onChange={handleChange}
          max={10}
          disabled={loading}
        />
        <label
          htmlFor="id-dropzone02"
          className="flex cursor-pointer w-3/4 flex-col items-center gap-6 rounded border border-dashed border-slate-300 px-6 py-10 text-center min-h-[250px] justify-center"
        >
          {preview && (
            <div className="flex flex-col items-center w-full relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="mb-2 self-end text-slate-400 hover:text-red-500 absolute "
                aria-label="Delete image"
                tabIndex={-1}
              >
                {/* Bin icon */}
                <svg
                  style={{
                    height: "15px",
                  }}
                  id="bin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#fb0404"
                    d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
              </button>
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 rounded shadow object-contain mb-2"
              />
            </div>
          )}

          {upload && loading && (
            <div className="text-center flex flex-col items-center gap-3">
              <span className="loader"></span>
              uploading images ...
            </div>
          )}

          {!upload && loading && (
            <div className="mt-4 text-center text-slate-500">
              Loading image...
            </div>
          )}

          {!preview && !loading && (
            <>
              <span className="inline-flex h-12 items-center justify-center self-center rounded bg-slate-100/70 px-3 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="File input icon"
                  role="graphics-symbol"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </span>
              <p className="flex flex-col items-center justify-center gap-1 text-sm">
                <span className="text-emerald-500 hover:text-emerald-500">
                  Upload media
                  <span className="text-slate-500"> or drag and drop </span>
                </span>
                <span className="text-slate-600">
                  PNG, JPG or GIF up to 10MB,
                </span>
                {upload && <span> max 10 files</span>}
              </p>
            </>
          )}
        </label>
      </div>
    </>
  );
}
