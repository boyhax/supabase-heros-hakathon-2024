"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
// @ts-ignore
import Files from "react-files";
// @ts-ignore
import QuillEditor from "@/components/QuillEditor";
import "react-quill/dist/quill.snow.css";
import { WithContext as ReactTags } from "react-tag-input";
import suggestions from "@/utils/tagsSuggetions";
import { Card } from "@/components/card";

export default function Create() {
  const supabase = createClient();
  const [images, setimages] = useState<File[]>();
  const [data, setdata] = useState<Partial<Card>>({});
  const handleChange = (files: any) => {
    console.log(files);
    setimages(files);
  };

  const handleError = (error: any, file: any) => {
    console.log("error code " + error.code + ": " + error.message);
  };
  const [tags, setTags] = useState([{ id: "Supabase", text: "Supabase" }]);

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: any) => {
    setTags([...tags, tag]);
  };

  return (
    <>
      <form className={"mt-4 flex flex-col w-full px-20 justify-start gap-2"}>
        <Files
          className="files-dropzone"
          onChange={handleChange}
          onError={handleError}
          accepts={["image/*"]}
          multiple
          maxFileSize={10000000}
          minFileSize={0}
          clickable
        >
          <div className="  w-64 max-w-sm h-56 bg-background/90 border border-dashed rounded-xl flex justify-center items-center p-5">
            {images?.length ? (
              images?.slice(0, 2).map((file, index) => (
                <div
                  key={index}
                  className="relative w-full h-full overflow-hidden rounded-xl"
                >
                  <img
                    src={URL.createObjectURL(file)}
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
        <input
          type="text"
          name={"title"}
          minLength={10}
          maxLength={100}
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
        />
        <input
          type="text"
          name={"desciption"}
          maxLength={200}
          placeholder="desciption"
          className="input input-bordered w-full max-w-xl"
        />
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          //   delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          // handleDrag={handleDrag}
          // handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
          inline
          classNames={{
            tag: "border rounded-xl p-1  ",
            tags: "tagsClass",
            tagInput: "tagInputClass input input-bordered",
            tagInputField: "tagInputFieldClass",
            selected: "selectedClass",
            remove: "removeClass",
            suggestions: "suggestionsClass",
            activeSuggestion: "activeSuggestionClass",
            // editTagInput: "editTagInputClass",
            // editTagInputField: "editTagInputField",
            // clearAll: "clearAllClass",
          }}
        />
        <QuillEditor
          onChange={(text) => setdata({ ...data, body: text })}
          value={data?.body! || ""}
          key={"quilleditorCreate"}
        />
      </form>
    </>
  );
}
