'use client'

import { MessageCircle, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { twMerge } from 'tailwind-merge';
import { Chat } from '@prisma/client'
import { motion } from 'framer-motion'
import { useRouter } from 'nextjs-toploader/app'
import { toast } from 'sonner';
import { createCheckoutSession } from '~/server/actions';
import NewChatButton from './NewChatButton';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ChatSideBar({chats, chatID} : { chats: Chat[], chatID: string}) {

  const router = useRouter()
  const { data: session } = useSession()
  const isPro = session?.user.isPro

  useEffect(() => {
     const selectedChat = document.querySelector('.chats.selected') as HTMLButtonElement
     if(selectedChat) selectedChat.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center'})
  }, [chatID])

    return <div className="min-h-screen flex flex-col p-3 gap-2 text-white bg-[#0c0b1d] w-1/5 mb:w-full overflow-hidden">
             <NewChatButton />
             <div id='chats' className='flex flex-col p-1 gap-3 overflow-y-scroll h-[40rem] mb:h-[30rem]'>
               {chats.map((chat,i) => {
                return <motion.button initial={{opacity: 0, y: 7}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.1, ease: 'easeInOut'}} key={i} onClick={() => router.push(`/chats/${chat.id}`)} 
                className={twMerge('chats flex items-center gap-3 text-lg font-semibold border rounded-lg p-3 border-gray-800 duration-300', chat.id === chatID ? 'border-transparent bg-[#008000] selected' : 'hover:bg-white/10')}>
                      <span><MessageCircle /></span>
                      <p className='text-ellipsis truncate whitespace-nowrap'>{chat.pdfName}</p>
                </motion.button>
               })}
                {/* <div className='w-5 h-screen grow bg-red-500'/> */}
               </div>
               <div className='flex flex-col p-1 gap-1 justify-between border-t border-gray-400 py-2'>
                    <Link href={'/'} className='group text-center rounded-full flex-center gap-2 py-2 bg-white/20'> <ArrowLeft className='group-hover:-translate-x-1.5 duration-300'/> Go to Home</Link>
                   {!isPro && (
                        <Tooltip>
                        <TooltipTrigger>
                              <motion.button onClick={() => {
                                toast.promise(createCheckoutSession() , { loading: 'Directing to Stripe page...', success: 'Directed', error: 'Something went wrong'})
                              }} initial={{opacity: 0, y: 15}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4, type: 'spring', bounce: 0.5}}
                              className='flex-center gap-3 p-2 text-lg font-bold w-full bg-gradient-to-b from-green-500 to-green-800 rounded-full'>
                              <Zap /> Upgrade To Premium
                            </motion.button>
                        </TooltipTrigger>
                         <TooltipContent className='bg-[#15123e] text-base rounded-sm border-[3px] border-gray-300 text-white font-semibold' sideOffset={10} side='top'>
                             Access to create 20 chats
                         </TooltipContent>
                     </Tooltip>
                   )}
               </div> 
        </div> 
}