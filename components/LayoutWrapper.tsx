"use client"; // Ensure it's a client component

import { usePathname } from "next/navigation";
import Footer from "@/components/FooterComponent";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  return (
    <div className="">
      {children}
      
    
      {pathname !== "/group-chat" && (
        <div className="mb-[4em] sm:mb-0">
          <Footer />
        </div>
      )}
    </div>
  );
}
