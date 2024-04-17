"use client";

import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SearchCards from "@/components/SearchCards";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default async function Index() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const tags = searchParams
    .get("tags")
    ?.split(",")
    .filter((v) => v != "");

  return (
    <div className="flex-1 w-full flex flex-col gap-5 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 w-full px-3">
        <main className="flex-1 flex flex-col gap-6 items-center">
          <div className={"flex flex-row justify-between gap-6 items-center mx-5 mt-5"}>
          <SearchBar />
            <button onClick={()=>router.push('/create')} className={"btn btn-outline  text-foreground "}>Create one +</button>
          </div>
          <div>
            <div className="card-actions justify-end">
              {tags?.map((tag) => {
                return (
                  <div
                    onClick={() => {
                      const searchstring = createQueryString(
                        "tags",
                        tags?.filter((t) => t !== tag).join(",")
                      );
                      router.push("?" + searchstring);
                    }}
                    className="badge badge-outline cursor-pointer"
                  >
                    #{tag}
                  </div>
                );
              })}
            </div>
          </div>
          <SearchCards />
        </main>
      </div>

      <Footer />
    </div>
  );
}
