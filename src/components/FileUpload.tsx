'use client'

import { useDropzone } from "react-dropzone"
import { FolderUp } from 'lucide-react';
import { toast } from "sonner";
import { uploadFile } from "~/lib/s3";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import AnimatedCircularProgressBar from "./ui/animated-circular-progress-bar";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";

export default function FileUpload() {

    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const [value,setValue] = useState<number>(0)
    
    const {data: session, status} = useSession()
    const isPro = session?.user.isPro

  useEffect(() => {
     if(!uploading) return
     const interval = setInterval(() => {
        setValue(prev => {
            if(!uploading) return 100
            if(prev >= 95) return 95
            if(Math.random() < 0.1) return prev + 7
            return prev + 2
        })
     }, 400)

     return () => clearInterval(interval)
  }, [uploading])

 const {mutateAsync: createChat, isPending} = useMutation({
    mutationFn: async (data : {fileName: string, fileKey: string}) => {
        const res = await axios.post('/api/create-chat', data)
        return res.data
    },
    onSuccess: ({ chatId }: {chatId: string}) => {
       toast.success('Chat created successfully')
       setTimeout(() => {
        router.push(`/chats/${chatId}`)
       }, 1000)
    },
    onError: (err) => {
        console.error(err)
        if(err instanceof AxiosError) {
            toast.error(err.response?.data.msg || 'Something went wrong!!')
        }
    }
 })

 const {data: chatCount} = useQuery<number>({
     queryKey: ['getChatCount'],
     queryFn: async () => {
       try {
        const { data : { chatCount }} = await axios.get('/api/chat')
        return chatCount
       } catch(err) {
           console.error(err)
           throw new Error('Error')
       }
     }
 })

 const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
    accept: { 'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (files: File[]) => {
   try {
        if(!isPro && chatCount && chatCount > 7) {
            toast.error('You can only create up to 7 chats. Please upgrade to Pro.')
            return
        }

        if(isPro && chatCount && chatCount > 20) {
            toast.error('You can only create up to 20 chats.')
            return
        }

        const file = files[0]
        if(file && file?.size >= 3 * 1024 * 1024) {
            toast.error('Please upload a file less than 3MB')
            return
        }

        if (file && file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed. Please upload a valid PDF.')
            return
          }

        setUploading(true)
        await new Promise(r => setTimeout(r, 5000))
        // Reversing the order of uploadFile and createChat will throw an error
        const data = await uploadFile(file) 
        await createChat(data)
        
        } catch(err) {
            console.error(err) 
            toast.error('File upload failed. Try again!!', { position: 'bottom-right'})
        } finally {
            setUploading(false)
            setValue(0)
        }
    }
 })

    return <div className="bg-secondary dark:bg-white/20 rounded-xl h-48 p-2 mt-3">
        <div {...getRootProps({className: 'group flex-center flex-col gap-3 bg-white/10 border-[3px] border-dashed border-green-500 dark:border-gray-300 cursor-pointer rounded-xl h-full'})}>
          {uploading ? (
            <AnimatedCircularProgressBar className="size-24" min={0} max={100} value={value} gaugePrimaryColor="rgb(34, 197, 94)" gaugeSecondaryColor="rgba(34, 197, 94, 0.1)"/>
          ) : (
            <>
            <input disabled={uploading} {...getInputProps()} />
            <FolderUp className="text-green-400 size-10 group-hover:scale-125 group-hover:text-green-600 duration-200"/>
            </>
          )}
            <p className={twMerge("text-lg font-semibold text-gray-400", uploading && 'animate-pulse duration-1000')}>{uploading ? 'uploading your pdf...' :' Drop your PDF here'}</p>
        </div>
    </div>
}
