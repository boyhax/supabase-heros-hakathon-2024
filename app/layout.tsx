import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/AuthButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background  text-foreground">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      
      <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
        <div className={'w-[500px]'}>
        <h2 className="font-bold text-4xl my-4">Cards for every one</h2>

        
        </div>
     
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
