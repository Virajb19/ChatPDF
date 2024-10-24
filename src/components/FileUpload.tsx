import { useDropzone } from "react-dropzone"
import { Inbox } from 'lucide-react';
import { toast } from "sonner";
import { uploadToS3 } from "~/lib/s3";

export default function FileUpload() {

 const {getRootProps, getInputProps} = useDropzone({
    accept: { 'application/pdf': ['.pdf']},
    maxFiles: 1,
    onDrop: async (files: File[]) => {
     const file = files[0] 
     if(file && file?.size > 1 * 1024 * 1024) {
        console.log('inside dropzone callback')
        toast.error('Please upload a file less than 1MB')
        return
     }
     const data = await uploadToS3(file)
     console.log(data)
    }
 })

    return <div className="bg-white rounded-xl h-40 p-2 mt-3">
        <div {...getRootProps({className: 'group flex-center flex-col gap-3 bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer rounded-xl h-full'})}>
            <input {...getInputProps()} />
            <Inbox className="text-purple-700 size-10 group-hover:scale-125 group-hover:text-purple-800 duration-200"/>
            <p className="text-lg font-semibold text-gray-400">Drop your PDF here</p>
        </div>
    </div>
}