'use client'

import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";
import { usePathname } from "next/navigation";

export default function Navbar() {

   const pathname = usePathname()

   if(pathname.includes('/chats')) return null
  return <nav className="fixed z-[99] inset-x-0 flex items-center p-3 justify-between border-b border-gray-600">
            <div className="flex items-center gap-3">
                 <h2 className="font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">ChatPDF</h2>
            </div>
             <div className="flex items-center gap-4 mr-2 sm:mr-10">
               <ThemeToggle />
               <UserAccountNav />
             </div>
  </nav>
}