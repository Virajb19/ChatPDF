'use client'

import { useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from 'usehooks-ts'
import { useEffect, useRef, useState } from "react";
import { Menu, X, Files} from 'lucide-react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Chat } from "@prisma/client";
import ChatSideBar from "./ChatSideBar";

export default function Navbar() {

  const { data: session, status} = useSession()
  const isAuth = session?.user
   
   const pathname = usePathname()
   const isLargeScreen = useMediaQuery('(min-width: 640px)')

   const showTitle = !pathname.includes('/chats') || isLargeScreen

   const [isOpen, setIsOpen] = useState(false)

   const sidebarRef = useRef<HTMLDivElement>(null)

  //  toast.success(pathname)

   const chatId = pathname.split('/')[2] ?? ''

   const { data: chats } = useQuery<Chat[]>({
      queryKey: ['getChats'],
      queryFn: async () => {
         try {
            const { data: { chats }} = await axios.get('/api/getChats')
            return chats
         } catch(err) {
           console.error(err)
           throw new Error('Error')
         }
      },
      enabled: !isLargeScreen
   })


useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if(sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)

  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

   if(pathname.includes('/chats') && isLargeScreen) return null

  return <motion.nav initial={{y: -75}} animate={{y: 0}} transition={{duration: 0.8, type: 'spring', bounce: 0.6}}
    className="fixed z-[99] inset-x-0 flex items-center backdrop-blur-md p-3 justify-between border-b border-gray-600">
            <div className="flex items-center gap-1">
                 <Files className="text-green-600 size-7 sm:size-10" strokeWidth={2}/>
                  {pathname.includes('/chats') && (
                         <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 bg-white/10 rounded-2xl sm:hidden">
                           {isOpen ? <X /> : <Menu />}
                      </button>
                  )}
                 {showTitle && (
                    <h2 className="font-bold mb:text-3xl bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">ChatPDF</h2>
                 )}
            </div>
             <div className="flex items-center gap-4 mr-2 sm:mr-10">
               <ThemeToggle />
               {isAuth && <UserAccountNav />}
             </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div ref={sidebarRef} initial={{x: '-100%'}} animate={{x: 0}} exit={{x: '-100%'}} transition={{duration: 0.3, ease: 'easeInOut'}}
                     className="sm:hidden absolute top-24 left-0 h-[calc(90vh-2rem)] w-3/4 max-w-sm border rounded-r-xl flex flex-col gap-2 bg-[#11102b]">
                      <ChatSideBar chatID={chatId} chats={chats ?? []}/>
                    </motion.div>
                )}
            </AnimatePresence>
  </motion.nav>
}