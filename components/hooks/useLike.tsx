"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function useLike(id: string) {
  const [isliked, setisliked] = useState<boolean>(false);
  const [loading, setloading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setloading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error, count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("card_id", id);
    if (!error) {
      setisliked(count == 1);
    } else {
      setisliked(false);
    }
    setloading(false);
  }

  async function like() {
    setloading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error, count } = await supabase
      .from("likes")
      .upsert({
        user_id: user.id,
        card_id: id,
      })
      .select("*");

    if (!error) {
      setisliked(true);
    } else {
      setisliked(false);
    }
    setloading(false);
  }
  async function unlike() {
    setloading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error, count } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("card_id", id);

    if (!error) {
      setisliked(false);
    } 
    setloading(false);
  }
  return { isliked, like, unlike,loading };
}
