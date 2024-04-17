"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SimpleCard from "./SimpleCard";
import useFilter from "./hooks/useFilter";
import InfiniteScroll from "react-infinite-scroller";

export type Card = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  metas: string;
  images: string[];
  likes: number;
  types: string[];
};
export default function SearchCards() {
  const supabase = createClient();
  const [loading, setloading] = useState(true);
  const searchParams = useSearchParams();
  const [cards, setcards] = useState<Card[]>([]);
  const [hasMore, sethasMore] = useState(false);
  const { filter, remove } = useFilter();

  useEffect(() => {
    search();
  }, [searchParams]);

  async function search() {
    setloading(true);
    try {
      const tags = filter.tags;
      const q = filter.q;

      const query = supabase
        .from("cards")
        .select("id", { count: "exact", head: false });
      if (tags) {
        query.contains("tags", tags);
      }
      if (q) {
        query.ilike("fts", `%${q}%`);
      }

      const { data, error, count } = await query
        .limit(5)
        .order("created_at", { ascending: false });

      if (data) {
        setcards(data as Card[]);
        sethasMore(count ? count > data?.length! + cards?.length! : false);
      } else {
        sethasMore(false);
        console.log("no search result");
      }
      if (error) {
        console.log("search error :>> ", error);
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  }
  async function fetchMore() {
    if (loading) return;
    console.log("fetching more :>> ");

    setloading(true);
    try {
      const tags = filter.tags;
      const q = filter.q;

      const query = supabase
        .from("cards")
        .select("id", { count: "exact", head: false });
      if (tags) {
        query.contains("tags", tags);
      }
      if (q) {
        query.ilike("fts", `%${q}%`);
      }
      const start = cards?.length! + 1 || 0;
      const end = start + 1;
      const { data, error, count } = await query
        .range(start, end)
        .order("created_at", { ascending: false });

      if (data) {
        setcards([...cards, ...(data as Card[])]);
        sethasMore((count || 0) > data?.length! + cards?.length!);
      } else {
        sethasMore(false);
        console.log("no search result");
      }
      if (error) {
        console.log("search error :>> ", error);
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  }
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={fetchMore}
      hasMore={hasMore}
      loader={
        <div
          className="loading loading-ring loading-lg self-center "
          key={"loader"}
        ></div>
      }
      className={"flex flex-col items-center justify-center p-3"}
    >
      {loading ? <progress className="progress w-56"></progress> : null}
      <div className={"flex flex-wrap items-center justify-center  gap-2"}>
        {cards.map((card, i) => {
          return <SimpleCard key={"card" + card.id} id={card.id} />;
        })}
      </div>
    </InfiniteScroll>
  );
}
