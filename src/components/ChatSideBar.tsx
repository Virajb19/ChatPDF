'use client'

import axios from 'axios';
import { MessageCircle, CirclePlus } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

type chat = {
    pdfName: string;
    pdfURL: string | null;
    fileKey: string;
    id: string;
    createdAt: Date;
    userId: number;
}

export default function ChatSideBar({chats, chatID} : { chats: chat[], chatID: string}) {

    const [loading,setLoading] = useState(false)

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
            <button className='flex-center gap-1 border border-dashed border-white text-gray-300 hover:text-white duration-200 px-4 py-2 text-sm rounded-lg font-semibold'>
                <CirclePlus className='size-4'/>
                <Link href='/'>New Chat</Link>
            </button>
             <div id='chats' className='flex flex-col p-1 gap-3 overflow-y-auto scrollbar-thin scrollbar-track-transparent h-[39rem]'>
               {chats.map((chat,i) => {
                return <Link key={i} href={`/chats/${chat.id}`} >
                      <div className={twMerge("flex px-4 py-2 text-gray-300 gap-2 text-sm items-center rounded-lg tracking-wide", chat.id === chatID && "font-semibold bg-[#5602F0]", chat.id !== chatID && "hover:text-white duration-200")}>
                      <MessageCircle />
                      <p className='text-ellipsis truncate whitespace-nowrap'>{chat.pdfName}</p>
                  </div>
                </Link>
               })}
               </div>
               <div className='flex p-1 gap-1 justify-between items-center text-xs border-t border-gray-400 py-2'>
                   <Link className='text-gray-500 hover:text-white duration-200' href='/'>Home</Link>
                   <Link className='text-gray-500 hover:text-white duration-200' href='/'>Source</Link>
                   <button disabled={loading} onClick={handleSubscription} className={twMerge('text-sm truncate border border-gray-400 rounded-full px-3 py-1 hover:bg-[#5602F0] hover:border-transparent duration-300', loading && "text-gray-600 cursor-not-allowed border-gray-700 hover:bg-transparent")}>Upgrade to premium</button>
               </div> 
        </div> 
}