'use client'

import { useDropzone } from "react-dropzone"
import { CloudUpload, FolderUp } from 'lucide-react';
import { toast } from "sonner";
import { uploadFile } from "~/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios'
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import AnimatedCircularProgressBar from "./ui/animated-circular-progress-bar";
import { twMerge } from "tailwind-merge";
import { deleteAllFiles } from '~/lib/s3';
import { deleteChats } from "~/server/actions";

export default function FileUpload() {

    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const [value,setValue] = useState<number>(0)

  useEffect(() => {
     if(!uploading) return
     const interval = setInterval(() => {
        setValue(prev => {
            if(!uploading) return 100
            if(prev >= 97) return 97
            if(Math.random() < 0.1) return prev + 15
            return prev + 5
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

 const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
    accept: { 'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (files: File[]) => {
   try {
        const file = files[0] 
        if(file && file?.size > 3 * 1024 * 1024) {
            toast.error('Please upload a file less than 3MB')
            return
        }

        setUploading(true)
        await new Promise(r => setTimeout(r, 5000))
        const data = await uploadFile(file) 
        console.log(data)
        await createChat(data)
        
        } catch(err) {
            console.error(err) 
            toast.error('File upload failed. Try again!!')
        } finally {
            setUploading(false)
        }
    }
 })

    return <div className="bg-white/20 rounded-xl h-48 p-2 mt-3">
        <div {...getRootProps({className: 'group flex-center flex-col gap-3 bg-white/10 border-[3px] border-dashed border-gray-300 cursor-pointer rounded-xl h-full'})}>
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

        <button onClick={() => {
                 deleteAllFiles('6782148a002e26893ddb')
                 deleteChats()
              }} className='p-3 absolute top-1/2 left-20 bg-red-700 rounded-md'>
                delete
              </button>
    </div>
}
