'use client'

import { Send } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form'
import MessageList from './MessageList'
import { motion } from 'framer-motion'
import { useMutation, useQuery } from '@tanstack/react-query'
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

  const {data: initialMessages, isLoading} = useQuery<Message[]>({
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

  // const {} = useMutation({
  //   mutationFn: async (data: Input) => {
  //      const res = await axios.post(`/api/messages/${chatID}`)
  //   }
  // })

  const { input, handleSubmit, handleInputChange, messages} = useChat({ 
    api: '/api/chat',
    body: { chatID },
    initialMessages: formattedMessages,
    onFinish: async (message) => {
       const role = message.role === 'assistant' ? 'ASSISTANT' : 'USER'
       await saveMessage(message.content, chatID, role)
    }
 })

async function OnSubmit(data: Input) {
  handleSubmit({ preventDefault: () => {} }, { body: data })
  form.reset()
}


    return <div className="flex flex-col gap-2 border-l-2 border-slate-400 p-1 w-1/3">
        <h3 className='font-semibold'>Chat</h3>
        <MessageList messages={messages ?? []}/>
            <div className='flex items-center gap-3 p-2'>
               <Form {...form}>
                   <form className='flex items-center gap-3 w-full' onSubmit={form.handleSubmit(OnSubmit)}>
                   <FormField
                          control={form.control}
                          name='message'
                          render={({ field }) => (
                             <FormItem className='flex flex-col gap-1 grow'>
                              <FormControl>
                                <input {...field} className='input-style' placeholder='enter a prompt...'/>
                              </FormControl>
                             </FormItem>
                          )}
                        />

                        <motion.button disabled={form.formState.isSubmitting} whileHover={{scale: 1.05}} whileTap={{scale: 0.9}} className='p-3 group flex-center rounded-xl bg-green-700'>
                           <Send />
                        </motion.button>
                   </form>
               </Form>
            </div>
        </div>
}