import { create } from 'zustand'

type uploadingState = {
    uploading: boolean,
    setUploading: (value: boolean) => void
}

export const useUploadingState = create<uploadingState>((set,get) => ({
    uploading: false,
    setUploading: (value: boolean) => {
        set({uploading: value})
    }
}))

type loadingState = {
    loading: boolean,
    setLoading: (value: boolean) => void
}

export const useLoadingState = create<loadingState>((set, get) => ({
     loading: false,
     setLoading: (value: boolean) => {
        set({ loading: value})
     }
}))

// type useChatStore = {
//     chatId: string | null,
//     setChatId: (chatId: string) => void
// }

// export const useChatStore = create<useChatStore>((set,get) => ({
//     chatId: localStorage.getItem('chatId') || null,
//     setChatId: (chatId: string) => {
//         localStorage.setItem('chatId', chatId)
//         set({ chatId })
//     }
// }))