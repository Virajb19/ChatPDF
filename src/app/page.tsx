import Link from 'next/link'
import { LogIn, ArrowRightToLine } from 'lucide-react';
import FileUpload from '~/components/FileUpload';
import { checkSubscription } from '~/lib/subscription';
import SubscriptionButton from '~/components/SubscriptionButton';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { Chat } from '@prisma/client';

export default async  function HomePage() {

 const session = await getServerAuthSession()
 const isAuth = !!session?.user

 const isPro = await checkSubscription()

 let firstChat: Chat | null = null
 if(session?.user) {
    firstChat = await db.chat.findFirst({where: {userId: parseInt(session?.user.id)}})
 }

    // (STATUS === 'LOADING') RETURN <SPINNER />
     return <main className="w-full min-h-screen flex-center bg-gradient-to-r from-rose-200 to-teal-200 text-black">
                <div id='homepage' className="flex flex-col p-1 gap-1 items-center">
                <div id='avatar' className='flex p-1 gap-2 items-center'>
                 <h1 className="mb:text-3xl tb:text-c-5xl font-medium mb:tracking-tighter">Chat with any PDF</h1>
                 </div>
                 <div id='buttons' className='flex p-1 gap-4 mb:text-sm'>
                 {isAuth && firstChat && <Link href={`/chats/${firstChat.id}`}><button className='flex gap-2 items-center px-4 py-2 bg-black text-white rounded-lg font-semibold group'>Go to chats<span className='group-hover:translate-x-1.5 duration-200'><ArrowRightToLine /></span></button></Link>}
                 <SubscriptionButton isPro={isPro}/>
                 </div>
                 <p className='max-w-xl lg:text-xl mt-2 text-center'>Join millions of students, researchers and professionals to
                 instantly anwer questions and understand research with AI</p>
                 {isAuth ? <div className='sm:w-[60%] w-[90%]'><FileUpload /></div> : <Link href={'/signup'}><button className='flex gap-2 items-center px-4 py-2 mt-3 min-w-1/2 bg-black text-white rounded-lg font-semibold text-sm hover:gap-4 transition-all'>Sign up to get started !<span><LogIn /></span></button></Link>}
              </div>
        </main>
}