'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Avatar from 'react-avatar'
import { LogIn, ArrowRightToLine } from 'lucide-react';
import { useRef, useState } from 'react'
import FileUpload from '~/components/FileUpload';
import Spinner from '~/components/Spinner';

export default function HomePage() {

 const { data:session, status } = useSession()
 const isAuth = !!session

 const fileRef = useRef<HTMLInputElement | null>(null)
 const [avatarURL, setAvatarURL] = useState<string>('https://imgs.search.brave.com/L3QH_L8tiQCkvsAiK-xmjN_tlyqcBzdBdRAs8RHlNmU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA3LzAzLzg2LzEx/LzM2MF9GXzcwMzg2/MTExNF83WXhJUG5v/SDhOZm1ieUVmZk96/aWFYeTBFTzFOcFJI/RC5qcGc')


 function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if(file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarURL(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}

if(status === 'loading') return <Spinner />

     return <main className="w-full min-h-screen flex-center bg-gradient-to-r from-rose-200 to-teal-200 text-black">
               <div id='homepage' className="flex flex-col p-1 gap-1 items-center">
                 <div id='avatar' className='flex p-1 gap-2 items-center'>
                  <h1 className="mb:text-3xl tb:text-c-5xl font-medium mb:tracking-tighter">Chat with any PDF</h1>
                  {isAuth && <div className='flex'>
                  <Avatar onClick={() => fileRef.current?.click()} className='cursor-pointer' size='50' round src={avatarURL} />
                  <input onChange={handleFileChange} type='file' accept='image/*' ref={fileRef} style={{display: 'none'}}/>
                   </div>
                  }
                  </div>
                  {isAuth && <button className='flex gap-2 items-center px-4 py-2 bg-black text-white rounded-lg font-semibold group'>Go to chats<span className='group-hover:translate-x-1.5 duration-200'><ArrowRightToLine /></span></button>}
                  <p className='max-w-xl lg:text-xl mt-2 text-center'>Join millions of students, researchers and professinals to
                  instantly anwer questions and understand research with AI</p>
                  {isAuth ? <div className='sm:w-[60%] w-[90%]'><FileUpload /></div> : <Link href={'/signin'}><button className='flex gap-2 items-center px-4 py-2 mt-3 min-w-1/2 bg-black text-white rounded-lg font-semibold text-sm hover:gap-4 transition-all'>Login to get started !<span><LogIn /></span></button></Link>}
               </div>
        </main>
}