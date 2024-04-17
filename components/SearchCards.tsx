"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SimpleCard from "./SimpleCard";
import useFilter from "./hooks/useFilter";
//@ts-ignore
import InfiniteScroll from "react-infinite-scroller";
import { Card } from "./card";


const limit = 5;
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
  console.log("hasMore :>> ", hasMore);

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
        .limit(limit)
        .order("created_at", { ascending: false });

      if (data) {
        setcards(data as Card[]);
        const hasMore = data?.length >= limit;
        sethasMore(hasMore);
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
        .select("id", { count: "exact", head: false })
        .order("created_at", { ascending: false });
      if (tags) {
        query.contains("tags", tags);
      }
      if (q) {
        query.ilike("fts", `%${q}%`);
      }
      const start = cards?.length! + 1 || 0;
      const end = start + limit;
      const lastcard = cards?.pop()!;
      const lastTime = lastcard
        ? lastcard?.created_at
        : new Date().toISOString();
      const { data, error, count } = await query
        .range(start,end)
        .limit(limit);
      if (data) {
        setcards([...cards, ...(data as Card[])]);

        const hasMore = data?.length >= limit;
        sethasMore(hasMore);
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
