'use client'

import { SendHorizonal, BotMessageSquare, Loader2 } from 'lucide-react'
import MessageList from './MessageList'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Message } from '@prisma/client'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { createMessageSchema } from '~/lib/zod'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useEffect, useMemo } from 'react'
import { saveMessage } from '~/server/actions'
import { useChatStreamStore } from '~/lib/store'

type Input = z.infer<typeof createMessageSchema>

function getText(message: UIMessage): string {
  return message.parts.filter(p => p.type === 'text').map(p => p.text).join('')
}


export default function ChatComponent({chatID}: {chatID: string}) {

  const {data: initialMessages = [], isFetching, isError} = useQuery<Message[]>({
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
      return initialMessages.map(message => ({
           id: message.id,
           role: message.role.toLowerCase() as 'user' | 'assistant',
           parts: [{ type: 'text' as const, text: message.content}]
      }))
  }, [initialMessages])

  const form = useForm<Input>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: { message: ''}
  })

  const onSubmit = async (data: Input) => {
  await sendMessage({
    role: 'user',
    parts: [{ type: 'text', text: data.message}],
    metadata: { chatID }
  })

  form.reset()
}

/**
 * WHY THIS CHANGE?
 *
 * When an AI response is streaming, switching to another chat causes the
 * in-progress streamed message to be lost from the UI. Since `useChat`
 * keeps its streaming state locally, navigating away unmounts the component
 * and the partial assistant message disappears until a full refresh.
 *
 * To prevent this UX issue, we introduce a global "isStreaming" state
 * (via Zustand) and temporarily disable chat switching while streaming
 * is active. This ensures:
 *
 * - Streamed responses are not accidentally lost
 * - Users do not see inconsistent or missing messages
 * - Chat navigation behaves predictably during AI generation
 *
 * Chat switching is re-enabled once the AI finishes, errors, or aborts.
 */

const { startStreaming, stopStreaming } = useChatStreamStore()

  const { messages: streamedMessages, sendMessage, status} = useChat({ 
    onFinish: async ({ message }) => {
        stopStreaming()
        const text = getText(message)
        const role = message.role === 'assistant' ? 'ASSISTANT' : 'USER'
        await saveMessage(text, chatID, role)
    },
    onError: () => stopStreaming()
 })

 useEffect(() => {
    if (status === 'submitted' || status === 'streaming') {
      startStreaming()
    } else {
      stopStreaming()
    }
}, [status])


 const messages: UIMessage[] = [...formattedMessages, ...streamedMessages]
 const isLoading = status === 'submitted'

    return <div className="flex flex-col h-full bg-card sm:border-l-2 border-slate-400 p-1 w-1/3 mb:w-full overflow-hidden">
         <div className='flex items-center gap-3 mb:hidden'>
            <BotMessageSquare className='size-7'/>
           <h3 className='font-semibold'>Chat</h3>
         </div>
        <MessageList messages={messages ?? []} isLoading={isLoading} isFetching={isFetching}/>
            <div className='flex items-center gap-3 p-2 border-t-[3px] border-slate-600'>
                   <form className='flex items-center gap-3 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                                <input disabled={form.formState.isSubmitting || isLoading} {...form.register('message')} className='input-style grow disabled:opacity-75' placeholder='enter a prompt...'/>

                        <motion.button type='submit' disabled={form.formState.isSubmitting || isLoading} whileHover={{scale: 1.01}} whileTap={{scale: 0.9}} className='p-2 group flex-center rounded-xl bg-green-700 disabled:opacity-70'>
                           {isLoading ? (
                               <Loader2 className='animate-spin'/>
                           ) : (
                             <SendHorizonal />
                           )}
                        </motion.button>

                   </form>
            </div>
        </div>
}