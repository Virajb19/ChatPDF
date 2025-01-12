'use client'

import axios from 'axios';
import { MessageCircle, CirclePlus } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { Chat } from '@prisma/client'
import { useRouter } from 'nextjs-toploader/app';
import { motion } from 'framer-motion'

export default function ChatSideBar({chats, chatID} : { chats: Chat[], chatID: string}) {

    const [loading,setLoading] = useState(false)

    const router = useRouter()

    async function handleSubscription() {
      const loadID = toast.loading('Directing to stripe payment page...')
       try {
         setLoading(true)
        const response = await axios.get('/api/stripe')
        window.location.href = response.data.url
      } catch(error) {
        toast.error('Something went wrong. Try again !!!')
      } finally {
        setLoading(false)
        toast.dismiss(loadID)
       }
    }

    return <div className="min-h-screen flex flex-col p-3 gap-2 text-white bg-[#15122e] w-1/5">
            <button className='flex-center gap-2 border-2 border-dashed border-white/40 text-gray-300 opacity-80 hover:opacity-100 duration-200 px-4 py-2 text-lg rounded-lg font-bold'>
                <CirclePlus className='size-6' strokeWidth={3}/>
                 New Chat
            </button>
             <div id='chats' className='flex flex-col p-1 gap-3 overflow-y-scroll h-[39rem]'>
               {chats.map((chat,i) => {
                return <motion.button initial={{y: 7, opacity: 0, scale: 0.8}} animate={{y: 0, opacity: 1, scale: 1}} transition={{duration: 0.6, delay: i * 0.3, type: 'spring', bounce: 0.7}} key={i} onClick={() => router.push(`/chats/${chat.id}`)} 
                className={twMerge('flex items-center gap-3 text-lg font-semibold border rounded-lg p-3 overflow-hidden border-gray-800 duration-300', chat.id === chatID ? 'border-transparent bg-green-600' : 'hover:bg-white/10')}>
                      <MessageCircle />
                      <p className='text-ellipsis truncate whitespace-nowrap'>{chat.pdfName}</p>
                </motion.button>
               })}
               </div>
               <div className='flex p-1 gap-1 justify-between items-center text-xs border-t border-gray-400 py-2'>
                   <Link className='text-gray-500 hover:text-white duration-200' href='/'>Home</Link>
                   <Link className='text-gray-500 hover:text-white duration-200' href='/'>Source</Link>
                   <button disabled={loading} onClick={handleSubscription} className={twMerge('text-sm truncate border border-gray-400 rounded-full px-3 py-1 hover:bg-[#5602F0] hover:border-transparent duration-300', loading && "text-gray-600 cursor-not-allowed border-gray-700 hover:bg-transparent")}>Upgrade to premium</button>
               </div> 
        </div> 
}