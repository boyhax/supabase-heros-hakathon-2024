import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Logos";
import { redirect } from "next/navigation";

export default async function ProtectedPageLayout({children}:{children:any}) {


  return (
   <div>
    
    {children}
    </div>
  );
}
