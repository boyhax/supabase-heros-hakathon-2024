'use client'
import Filters from "@/components/Filters";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SearchCards from "@/components/SearchCards";
import { useRouter } from "next/navigation";

export default  function Index(props: any) {
  const router = useRouter();

  return (
    <div className="flex-1 w-full flex flex-col gap-5 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 w-full px-3">
        <main className="flex-1 flex flex-col gap-6 items-center">
          <div
            className={
              "flex flex-row justify-between gap-6 items-center mx-5 mt-5"
            }
          >
            <SearchBar />
            <button
              onClick={() => router.push("/create")}
              className={"btn btn-outline  text-foreground "}
            >
              Create one +
            </button>
          </div>
          <div>
            <Filters />
          </div>
          <SearchCards />
        </main>
      </div>

      <Footer />
    </div>
  );
}
