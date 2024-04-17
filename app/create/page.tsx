"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
// @ts-ignore
import Files from "react-files";
// @ts-ignore
import QuillEditor from "@/components/QuillEditor";
import "react-quill/dist/quill.snow.css";

import { Card } from "@/components/card";
import fileToBlob from "@/utils/fileToBlob";
import { useRouter } from "next/navigation";
import useFetch from "@/components/hooks/useFetch";
import TagInput from "@/components/TagInput";

const max_images = 2;

async function getUserCard() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: { message: "no card found" } };
    } else {
      return await supabase
        .from("cards")
        .select()
        .eq("user_id", user.id)
        .single();
    }
  } catch (error) {
    console.log("error :>> ", error);
  }
}
async function deleteStorageObjects(paths: string[]) {
  const supabase = createClient();
  return await supabase.storage.from("images").remove(paths);
}

async function uploadFiles(files: File[]) {
  const supabase = createClient();

  const queries = files.map((file) =>
    fileToBlob(file).then((blob) =>
      supabase.storage.from("images").upload("public/" + file.name, blob, {
        cacheControl: "3600",
        upsert: false,
      })
    )
  );
  const uplodaResult = await Promise.all(queries);
  let urls: string[] = [];
  let values: (
    | {
        data: {
          path: string;
        };
        error: null;
      }
    | {
        data: null;
        error: any;
      }
  )[] = [];
  uplodaResult.forEach((value, index, array) => {
    value.data &&
      value.data.path &&
      urls.push(
        supabase.storage.from("images").getPublicUrl(value.data.path).data
          .publicUrl
      );
    values.push(value);
  });
  return { urls, values };
}
export default function Create() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const supabase = createClient();
  const [images, setimages] = useState<File[]>();
  const [data, setdata] = useState<Partial<Card>>({
    type: "simple",
    description: "using supabase is fun ",
    title: "supabase user was here",
  });

  const handleChange = (files: any) => {
    console.log(files);
    setimages(files);
  };
  async function hundleSubmit() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      setloading(true);
      let urls: string[] = [];
      if (images?.length) {
        const upload = await uploadFiles(images);
        urls = upload.urls;
      }
      const newData = {
        ...data,
        user_id: user.id,
        images: urls,
      };
      const { data: uploaded, error } = await supabase
        .from("cards")
        .upsert(newData)
        .select()
        .single();
      console.log("uploaded :>> ", uploaded);
      if (error) {
        await deleteStorageObjects(
          urls.map((url) =>
            url
              .split("/")
              .slice(url.split("/").length - 3)
              .join("/")
          )
        );
      }
      
      setloading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }
  const handleError = (error: any, file: any) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  return (
    <>
      <form
        id={"form"}
        key={"createform"}
        onSubmit={(e) => {
          e.preventDefault();
          hundleSubmit();
        }}
        className={"mt-4 flex flex-col w-full px-20 justify-start gap-3"}
      >
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
          value={data?.title!}
          minLength={10}
          maxLength={100}
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setdata({ ...data, title: e.currentTarget.value })}
        />
        <input
          type="text"
          name={"description"}
          value={data?.description!}
          maxLength={200}
          placeholder="description"
          className="input input-bordered w-full max-w-xl"
          onChange={(e) =>
            setdata({ ...data, description: e.currentTarget.value })
          }
        />
        <TagInput
          onChange={(tags) => setdata({ ...data, tags })}
          value={data?.tags ?? []}
        />
        <QuillEditor
          onChange={(text) => setdata({ ...data, body: text })}
          value={data?.body! || ""}
          key={"quilleditorCreate"}
        />

        <button
          disabled={loading}
          form={"form"}
          type={"submit"}
          className={"btn btn-primary  "}
        >
          Publish
        </button>
      </form>
    </>
  );
}
