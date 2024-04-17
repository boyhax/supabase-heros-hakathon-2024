import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Logos";
import { redirect } from "next/navigation";

export default async function ProtectedPageLayout({children}:{children:any}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
   <div className={'flex flex-col mx-9 sm:mx-12  items-center w-full'}>
    {children}
    </div>
  );
}
