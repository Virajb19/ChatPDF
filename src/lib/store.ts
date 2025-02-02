import { create } from 'zustand'

type useChatStore = {
    chatId: string | null,
    setChatId: (chatId: string) => void
}

export const useChatStore = create<useChatStore>((set,get) => ({
    chatId: localStorage.getItem('chatId') || null,
    setChatId: (chatId: string) => {
        localStorage.setItem('chatId', chatId)
        set({ chatId })
    }
}))