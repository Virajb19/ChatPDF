import { Message } from "ai/react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function MessageList({messages} : { messages: Message[]}) {

  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
     if(divRef.current) divRef.current.scrollIntoView({ behavior: 'smooth'})
  }, [messages])

    return <div className="flex flex-col p-1 gap-3 max-h-[40rem] overflow-y-scroll scrollbar-none text-xs border-t border-slate-500">
               {messages?.map((message,i) => { 
                 return <p key={i} className={twMerge("w-fit ml-2 self-end shadow-sm shadow-black font-semibold text-left p-2 rounded-lg bg-[#5602F0] text-white max-w-1/2 ", 
                  message.role === 'assistant' && "self-start mr-2 bg-transparent text-black border border-gray-600 shadow-md shadow-black whitespace-pre-wrap")}>{message.content}</p>
               })}
              <div ref={divRef} />
        </div>
}