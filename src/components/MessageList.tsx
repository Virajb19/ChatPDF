import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Message } from 'ai'
import { motion } from 'framer-motion'
import { Bot, User, Loader2 } from 'lucide-react'
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function MessageList({messages, isLoading, isFetching} : { messages: Message[], isLoading: boolean, isFetching: boolean}) {

  const {data: session, status} = useSession()
  const user = session?.user

  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
     if(divRef.current) divRef.current.scrollIntoView({ behavior: 'smooth'})
  }, [messages])

  useEffect(() => {
     const messageContainer = document.getElementById('message-container')
     if(messageContainer) {
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight,
          behavior: 'smooth'
        })
     }
  }, [messages]) 

  if(isFetching) return <div className="h-[43rem] mb:h-[calc(90vh-5rem)] grow flex-center  sm:border-t border-slate-500">
         <Loader2 className="size-12 text-green-600 animate-spin"/>
  </div>

    return <div id="message-container" className="flex flex-col p-2 grow gap-3 max-h-[43rem] mb:h-[calc(90vh-5rem)] overflow-y-scroll text-sm sm:border-t border-slate-500">
               {messages.map((message,i) => { 
                 return <div className={twMerge("flex items-start gap-2", message.role === "user" && 'flex-row-reverse items-center')}>
                  {message.role === 'assistant' ? (
                      <span className="p-2 bg-green-800 rounded-full"> <Bot /> </span>
                  ) : user?.image ?  (
                     <Image src={user.image} alt="user" width={40} height={40} className="rounded-full"/>
                  ) : ( 
                     <div className="p-2 flex-center size-10 rounded-full bg-gradient-to-b from-green-400 to-green-700">
                       <User className="size-6" />
                  </div>                 
                )}
                  <motion.p key={i} initial={{opacity: 0, scale: 0.8}} animate={{opacity:1, scale: 1}} transition={{duration: 0.4, type: 'spring', bounce: 0.4}}
                       className={twMerge("w-fit mr-2 self-end shadow-sm shadow-black font-semibold text-left p-2 rounded-3xl bg-green-700 max-w-1/2 ", 
                       message.role === "assistant" && "self-start mr-10 p-3 bg-white/20 border border-gray-600 whitespace-pre-wrap")}>
                       {message.content}
                     </motion.p>
                  </div>
               })}
               {isLoading && (
                  <p className="italic font-bold text-gray-500 text-lg animate-pulse">
                     Generating...
                  </p>
               )}
              <div ref={divRef} />
        </div>
}