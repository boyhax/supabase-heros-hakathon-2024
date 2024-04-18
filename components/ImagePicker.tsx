'use client'
// @ts-ignore
import Files from "react-files";

export default function ImagePicker({
  files,
  onChange,
  onError,
}: {
  files: (File | string)[];
  onChange: (files: File[]) => void;
  onError: (error: any) => void;
}) {
  return (
    <Files
      className="files-dropzone"
      onChange={onChange}
      onError={onerror}
      accepts={["image/*"]}
      multiple
      maxFileSize={10000000}
      minFileSize={0}
      clickable
    >
      <div className="  w-64 max-w-sm h-56 bg-background/90 border border-dashed rounded-xl flex justify-center items-center p-5">
        {files?.length ? (
          files?.map((file, index) => (
            <div
              key={index}
              className="relative w-full h-full overflow-hidden rounded-xl"
            >
              <img
                src={typeof file == "string" ? file : URL.createObjectURL(file)}
                alt={`Image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 flex justify-center items-center">
                <span className="text-white">change {index + 1}</span>
              </div>
            </div>
          ))
        ) : (
          <div
            key={"imagepick"}
            className="relative w-full h-full overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-black opacity-40 hover:opacity-50 transition-opacity duration-300 flex justify-center items-center">
              <span className="text-white">pick images </span>
            </div>
          </div>
        )}
      </div>
    </Files>
  );
}
