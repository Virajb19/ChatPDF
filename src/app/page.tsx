'use client'
import Avatar from 'react-avatar'

export default function HomePage() {
    return <main className="w-full min-h-screen flex-center bg-black text-white">
               <div className="flex flex-col p-1 gap-1">
                 <div id='avatar' className='flex p-1 gap-2 items-center'>
                  <h1 className="mb:text-3xl tb:text-c-5xl">Chat with any PDF</h1>
                  <Avatar src='https://imgs.search.brave.com/gtfOZaAIi09umZr6NiLshAqo2QASpEFDHY85eVN5Xh4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9kb2Nz/Lm1hdGVyaWFsLXRh/aWx3aW5kLmNvbS9p/bWcvZmFjZS0yLmpw/Zw' size='50' round />
                  </div>
               </div>
        </main>
}