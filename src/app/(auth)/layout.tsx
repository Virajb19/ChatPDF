import { ReactNode } from "react";
import { StarsBackground } from "~/components/ui/stars-background";

export default async function AuthLayout({children}: {children: ReactNode}) {
   return <div className="relative overflow-hidden">
      <StarsBackground />
       {children}
   </div>
}