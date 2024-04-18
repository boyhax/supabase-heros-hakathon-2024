import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedPageLayout({
  children,
}: {
  children: any;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <Suspense fallback={<div className={"loading-infinity m-auto "}></div>}>
      <div className={"flex flex-col mx-9 sm:mx-12  items-center w-full"}>
        {children}
      </div>
    </Suspense>
  );
}
