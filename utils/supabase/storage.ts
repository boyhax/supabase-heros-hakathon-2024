import fileToBlob from "../fileToBlob";
import { createClient } from "./client";

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
  export  {deleteStorageObjects,fileToBlob,uploadFiles}