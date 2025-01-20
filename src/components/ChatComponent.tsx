'use client'

import { SendHorizonal, BotMessageSquare } from 'lucide-react'
import MessageList from './MessageList'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Message } from '@prisma/client'
import { Message as formattedMessage} from 'ai'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { createMessageSchema } from '~/lib/zod'
import { useChat } from 'ai/react'
import { useMemo } from 'react'
import { saveMessage } from '~/server/actions'

type Input = z.infer<typeof createMessageSchema>

export default function ChatComponent({chatID}: {chatID: string}) {

  const {data: initialMessages, isFetching} = useQuery<Message[]>({
    queryKey: ['getMessages', chatID],
    queryFn: async () => {
        try {
           const { data: { messages }} = await axios.get(`/api/messages/${chatID}`)
           return messages
        } catch(err) {
           console.error(err)
           throw new Error('Error fetching messages')
        }
    }
  })

  const formattedMessages = useMemo(() => {
      return initialMessages?.map(message => ({
           id: message.id,
           content: message.content,
           role: message.role.toLowerCase() as formattedMessage['role'],
           createdAt: message.createdAt
      }))
  }, [initialMessages])

  const form = useForm<Input>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: { message: ''}
  })

  const { input, handleSubmit, handleInputChange, messages, isLoading} = useChat({ 
    api: '/api/chat',
    body: { chatID },
    initialMessages: formattedMessages,
    onFinish: async (message) => {
       const role = message.role === 'assistant' ? 'ASSISTANT' : 'USER'
       await saveMessage(message.content, chatID, role)
    }
 })

    return <div className="flex flex-col gap-2 bg-card sm:border-l-2 border-slate-400 p-1 w-1/3 mb:w-full overflow-hidden">
         <div className='flex items-center gap-3 mb:hidden'>
            <BotMessageSquare className='size-7'/>
           <h3 className='font-semibold'>Chat</h3>
         </div>
        <MessageList messages={messages ?? []} isLoading={isLoading} isFetching={isFetching}/>
            <div className='flex items-center gap-3 p-2'>
                   <form className='flex items-center gap-3 w-full' onSubmit={handleSubmit}>
                                <input value={input} {...form.register('message')} onChange={handleInputChange} className='input-style grow' placeholder='enter a prompt...'/>

                        <motion.button type='submit' disabled={form.formState.isSubmitting} whileHover={{scale: 1.01}} whileTap={{scale: 0.9}} className='p-2 group flex-center rounded-xl bg-green-700 '>
                           <SendHorizonal />
                        </motion.button>

                   </form>
            </div>
        </div>
}