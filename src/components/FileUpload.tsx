import { useDropzone } from "react-dropzone"
import { Inbox } from 'lucide-react';
import { toast } from "sonner";
import { uploadToS3 } from "~/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios'
import Spinner from "./Spinner";
import { useState } from "react";
import { uploadS3ToPinecone } from "~/lib/pincone";

export default function FileUpload() {

    const [uploading, setUploading] = useState(false)

 const {mutate, isPending} = useMutation({
    mutationFn: async ({fileKey, fileName} : {fileKey: string, fileName: string}) => {
        const res = await axios.post('/api/create-chat', {pdfName: fileName, fileKey})
        return res.data
    }
 })

 const {getRootProps, getInputProps} = useDropzone({
    accept: { 'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (files: File[]) => {
     const file = files[0] 
     if(file && file?.size > 1 * 1024 * 1024) {
        toast.error('Please upload a file less than 1MB')
        return
     }
     setUploading(true)
    //  await new Promise(res => setTimeout(res,10000))
     const data = await uploadToS3(file)
     if(!data || !data?.fileKey || !data.fileName) {
        toast.error('Something went wrong. Try again !')
        return
     }
        mutate(data, {onSuccess: (data) => console.log(data), onError: (err) => toast.error('Error creating chat')})
        toast.success('File uploaded successfully')
        setUploading(false)
        await uploadS3ToPinecone(data.fileKey)
    }
 })

    return <div className="bg-white rounded-xl h-40 p-2 mt-3">
        <div {...getRootProps({className: 'group flex-center flex-col gap-3 bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer rounded-xl h-full'})}>
            <input {...getInputProps()} />
            {(uploading || isPending) ? <Spinner color="text-purple-700"/> : <Inbox className="text-purple-700 size-10 group-hover:scale-125 group-hover:text-purple-800 duration-200"/>}
            <p className="text-lg font-semibold text-gray-400">{(uploading || isPending) ? 'uploading your pdf...' :' Drop your PDF here'}</p>
        </div>
    </div>
}