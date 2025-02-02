import { Chat } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useMemo } from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"

export const useChat = () => {
    const [chatId, setChatId] = useLocalStorage('chatId', '')
    const {data: chats, isLoading, isError} = useQuery<Chat[]>({
        queryKey: ['getChats'],
        queryFn: async () => {
            try {
                const { data: { chats }} = await axios.get('/api/getChats')
                return chats
            } catch(err) {
                console.error(err)
                if(err instanceof AxiosError) toast.error(err.response?.data.msg || 'Something went wrong')
                throw new Error('Error fetching chats')
            }
        }
    })

    const currentChat = useMemo(() => {
        return chats?.find(chat => chat.id === chatId)
    }, [chatId, chats])

    if(isError) toast.error('Error fetching chats')

    return { chatId, chats, currentChat, isLoading }
}