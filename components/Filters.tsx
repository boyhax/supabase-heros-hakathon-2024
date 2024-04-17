import useFilter from "./hooks/useFilter";

export default function Filters() {
  const { filter, set, remove } = useFilter();

  return (
    <div>
      <div className="card-actions justify-end">
        {filter?.tags?.map((tag: string, i:number) => {
          return (
            <div
              onClick={() => {
                if (i == 0) {
                  remove("tags");
                } else {
                  const tags: string[] = filter?.tags || [];
                  tags.push(tag);
                  set("tags", tags);
                }
              }}
              className="badge badge-outline cursor-pointer"
            >
              #{tag}
            </div>
          );
        })}
      </div>
    </div>
  );
}
