"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function fromParams(searchParams: URLSearchParams) {
  var filter: any = {};
  const type = searchParams.get("type");
  const q = searchParams.get("q");
  const tags = searchParams.get("tags")?.replaceAll("%2C", "").split(",").filter(v=>v!="");
  if (type) {
    filter.type = type;
  }
  if (q) {
    filter.q = q;
  }
  if (tags) {
    filter.tags = tags;
  }
  return filter
}
export default function useFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = useMemo(()=>fromParams(searchParams),[searchParams]);
  
  const createQueryString = useCallback(
    (name: string, value: string|null) => {
      const params = new URLSearchParams(searchParams.toString());
      value !=null?params.set(name, value):params.delete(name);
      return params.toString();
    },
    [searchParams]
  );
  function set(name: string, value: string | string[]) {
    router.push(
      "?" +
        createQueryString(
          name,
          typeof value == "string" ? value : value.join(",")
        )
    );
  }
  function get(name: string) {
    return searchParams.get(name);
  }

  function remove(name:string) {
    router.push(
        "?" +
          createQueryString(
            name,
            null
          )
      );
  }
  return { set, get, filter, remove };
}
