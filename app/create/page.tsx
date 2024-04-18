"use client";
import { createClient } from "@/utils/supabase/client";
import { useMemo, useState } from "react";

// @ts-ignore
const DynamicTextEditor =dynamic(() => import("@/components/QuillEditor"), {
    
  loading: () => <p>loading...</p>,
  
  ssr: false,
  
  });
import TagInput from "@/components/TagInput";
import { Card } from "@/components/card";
import { deleteStorageObjects, uploadFiles } from "@/utils/supabase/storage";
import { useRouter } from "next/navigation";
import ImagePicker from "@/components/ImagePicker";
import dynamic from "next/dynamic";

export default function Create(props: any) {
  const max_images = 2;
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const supabase = createClient();
  const [images, setimages] = useState<File[]>();
  const [data, setdata] = useState<Partial<Card>>({
    type: "simple",
    description: "using supabase is fun ",
    title: "supabase user was here",
  });
  
  const hundleImageChange = (files: File[]) => {
    console.log(files);
    setimages(files.slice(0, max_images));
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
        <ImagePicker
          files={images || []}
          onChange={hundleImageChange}
          onError={(error) => {}}
          key={"imagepicker"}
        />
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
        <DynamicTextEditor
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
