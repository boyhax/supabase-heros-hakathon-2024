"use client";
import { createClient } from "@/utils/supabase/client";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useFetch from "./hooks/useFetch";
import useFilter from "./hooks/useFilter";
import useLike from "./hooks/useLike";
import { Card } from "./card";
import HtmlReader from "./HtmlReader";
import { HoverCardTrigger, HoverCard, HoverCardContent } from "./HoverCard";

export default function SimpleCard({ id }: { id: string; card?: Card }) {
  const supabase = createClient();
  const { data, error, loading } = useFetch(async () =>
    supabase.from("cards").select().eq("id", id).single()
  );
  const { isliked, like, unlike, loading: loadinglike } = useLike(id);
  const { filter, set } = useFilter();
  if (loading) {
    return (
      <div className={`card card-compact skeleton glass w-96 shadow-md `}></div>
    );
  }
  if (error) {
    return null;
  }

  const card: Card = data?.data;
  return (
    <div className={`card card-compact  glass w-96  shadow-md `}>
      {card?.images?.length ? (
        <div  className={`h-56  carousel carousel-vertical rounded-box `}>
          {card.images.map((url: string) => {
            return (
              <div key={'image'+url} className="carousel-item h-full w-full">
                <img className={"object-cover w-full h-full"} src={url} />
              </div>
            );
          })}
        </div>
      ) : null}

      <div className={"card-body "}>
        {/* <div>{card.id}</div> */}

        <p className={`card-title ${!card?.images?.length ? "text-2xl " : ""}`}>
          {card?.title!}
        </p>
        <p>{card.description}</p>
        {card.body ? (
          <HoverCard>
            <HoverCardTrigger>
              Show More{" "}
            </HoverCardTrigger>
            <HoverCardContent className={" glass z-[100] bg-background/90"}>
              <div className={"w-full h-full "}>
                <HtmlReader key={"htmlreader" + card.id} value={card.body} />
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : null}
        <div className="card-actions justify-end">
          {card?.tags?.map!((tag: string) => {
            return (
              <div
              key={'tag'+card.id+tag}
                onClick={() => {
                  set("tags", filter?.tags ? [...filter?.tags!, tag] : [tag]);
                }}
                className="badge badge-outline cursor-pointer"
              >
                #{tag}
              </div>
            );
          })}
        </div>
        <div className="card-actions justify-between items-center">
          <button className={"join join-horizontal gap-1"}>
            <p className={"join-item"}>{card.likes}</p>
            <p className={"join-item"}>likes</p>
          </button>
          <button
            onClick={!loadinglike ? (isliked ? unlike : like) : () => null}
            className=" p-2  rounded-sm  "
          >
            {!isliked ? (
              <AiOutlineHeart size={"2rem"} />
            ) : (
              <AiFillHeart color={"red"} size={"2rem"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
