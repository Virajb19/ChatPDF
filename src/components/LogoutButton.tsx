'use client'

import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export default function LogoutButton() {

 const session = useSession()
 const pathname = usePathname();

 if(!session || !session.data || pathname.startsWith('/chats')) return null

    return <button onClick={async () => {
      try {
       await signOut({callbackUrl: '/signin'})
       toast.success('Logged out successfully')
      } catch(e) {
        toast.error('Failed to log out. Please try again !')
      }
    }} className="absolute right-5 top-3 mb:text-sm flex px-4 py-2 gap-2 items-center bg-black text-white rounded-lg font-semibold hover:gap-4 hover:scale-105 transition-all">
           Log out
         <LogOut className='mb:size-5'/>
    </button>
}