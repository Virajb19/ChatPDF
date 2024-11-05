'use client'

import { Send } from 'lucide-react'
import { Message, useChat } from 'ai/react'
import MessageList from './MessageList'
import { motion } from 'framer-motion'
import { getMessages } from '~/actions/getMessages'
import { useEffect, useState } from 'react'
// import { Message } from '@prisma/client'

export default function ChatComponent({chatID}: {chatID: string}) {

  const [initialMessages, setInitialMessages] = useState<Message[]>([])

  useEffect(() => {
    async function main() {
        let messages: any = await getMessages(chatID)
        messages = messages.map((msg: any) => ({
          ...msg,
          role: msg.role.toLowerCase() as 'user' | 'system' | 'assistant' | 'data' | 'tool' | 'function'
        }))       
       setInitialMessages(messages)
    }
    main()
  }, [chatID])


  const { input, handleSubmit, handleInputChange, messages} = useChat({ 
    api: '/api/chat',
    body: {chatID},
    initialMessages,
    onFinish(message, options) {
      console.log('assistant reply: ',message)
    },
 })

    return <main className="relative text-black border-l-2 border-slate-400 p-1 w-1/3">
        <h3 className='font-semibold'>Chat</h3>
        <MessageList messages={messages}/>
        <form className='absolute bottom-1 inset-x-0 flex p-1 gap-2 items-center mt-2' onSubmit={handleSubmit}>
           <input value={input} onChange={handleInputChange} className='outline-none text-sm grow py-2 px-2 border-2 border-gray-400 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-purple-700 focus:border-transparent duration-200' type='text' placeholder='Ask any question...'/>
           <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className='p-2 bg-[#5602F0] text-white rounded-lg' type='submit'><Send className=''/></motion.button>
        </form>
        </main>
}