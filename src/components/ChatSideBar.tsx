import { MessageCircle, CirclePlus } from 'lucide-react'
import Link from 'next/link';
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

    return <div className="min-h-screen flex flex-col p-3 gap-2 text-white bg-[#15122e] overflow-y-scroll scrollbar-none w-1/5">
            <button className='flex-center gap-1 border border-dashed border-white text-gray-300 hover:text-white duration-200 px-4 py-2 text-sm rounded-lg font-semibold'>
                <CirclePlus className='size-4'/>
                <Link href='/'>New Chat</Link>
            </button>
             <div id='chats' className='flex flex-col p-1 gap-3 overflow-y-scroll scrollbar-none h-[90%]'>
               {chats.map((chat,i) => {
                return <Link key={i} href={`/chats/${chat.id}`} >
                      <div className={twMerge("flex px-4 py-2 text-gray-300 gap-2 text-sm items-center rounded-lg tracking-wide", chat.id === chatID && "font-semibold bg-[#5602F0]", chat.id !== chatID && "hover:text-white duration-200")}>
                      <MessageCircle />
                      <p className='text-ellipsis truncate whitespace-nowrap'>{chat.pdfName}</p>
                  </div>
                </Link>
               })}
               </div>
        </div> 
}