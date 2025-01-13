'use client'

import { useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ChatPDFIcon from "./ChatPdfIcon";

export default function Navbar() {

   const pathname = usePathname()
   const { data: session, status} = useSession()
   const isAuth = session?.user

   if(pathname.includes('/chats')) return null
  return <motion.nav initial={{y: -75}} animate={{y: 0}} transition={{duration: 0.8, type: 'spring', bounce: 0.6}}
    className="fixed z-[99] inset-x-0 flex items-center p-3 justify-between border-b border-gray-600">
            <div className="flex items-center gap-1">
                 <ChatPDFIcon size={53}/>
                 <h2 className="font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">ChatPDF</h2>
            </div>
             <div className="flex items-center gap-4 mr-2 sm:mr-10">
               <ThemeToggle />
               {isAuth && <UserAccountNav />}
             </div>
  </motion.nav>
}