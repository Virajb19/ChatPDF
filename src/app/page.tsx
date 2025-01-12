import Link from 'next/link'
import { LogIn, ArrowRightToLine } from 'lucide-react';
import FileUpload from '~/components/FileUpload';
import SubscriptionButton from '~/components/SubscriptionButton';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { Boxes } from "~/components/ui/background-boxes";

export default async function HomePage() {

 const session = await getServerAuthSession()
 const isAuth = !!session?.user

 const isPro = session?.user.isPro

//  await new Promise(r => setTimeout(r, 5000))

 const firstChat = await db.chat.findFirst({where: {userId: session?.user.id}})

     return <main className="w-full min-h-screen flex-center">
                <div id='homepage' className="flex flex-col p-2 gap-3 items-center">
                 <h1 className="mb:text-3xl tb:text-c-5xl font-medium mb:tracking-tighter">Chat with any PDF</h1>
                 <div id='buttons' className='flex p-1 gap-4 mb:text-sm'>
                 {isAuth && firstChat && <Link href={`/chats/${firstChat.id}`} className='flex gap-2 items-center px-4 py-2 bg-green-700 rounded-lg font-semibold group'>Go to chats<span className='group-hover:translate-x-1.5 duration-200'><ArrowRightToLine /></span></Link>}
                 <SubscriptionButton isPro={isPro ?? false}/>
                 </div>
                 <p className='max-w-xl lg:text-xl mt-2 text-center'>Join millions of students, researchers and professionals to
                 instantly anwer questions and understand research with AI</p>
                 {isAuth ? <div className='sm:w-[60%] w-[90%]'><FileUpload /></div> : <Link href={'/signup'}><button className='flex gap-2 items-center px-4 py-2 mt-3 min-w-1/2 bg-black text-white rounded-lg font-semibold text-sm hover:gap-4 transition-all'>Sign up to get started !<span><LogIn /></span></button></Link>}
                 {/* <AnimatedGridPattern
                     numSquares={30}
                     maxOpacity={0.1}
                     duration={3}
                     repeatDelay={1}
                     className={twMerge(
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                     )}
                  /> */}
                  {/* <StarsBackground /> */}
                  {/* <div className='absolute inset-0'>
                  <Boxes />
                  </div> */}
              </div>

        </main>
}