import { CirclePlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "~/components/ui/dialog";
import FileUpload from "./FileUpload";
import { useState } from "react";
import { useUploadingState } from "~/lib/store";

export default function NewChatButton() {

  const [open, setOpen] = useState(false)
  const { uploading } = useUploadingState()

  return <>
     <Dialog open={open} onOpenChange={state => {
           if(!uploading) setOpen(state)
     }}>
          <DialogTrigger>
               <button className='flex-center w-full gap-2 border-2 border-dashed border-white/40 text-gray-300 opacity-80 hover:opacity-100 duration-200 px-4 py-2 text-lg rounded-lg font-bold'>
                         <CirclePlus className='size-6' strokeWidth={3}/>
                         New Chat
               </button>
          </DialogTrigger>
          <DialogContent>
               <DialogTitle className="text-center text-3xl uppercase font-semibold">Create a Chat</DialogTitle>    
               <FileUpload />
          </DialogContent>
     </Dialog>
     <div className="h-px bg-gray-400"/>
  </>
}