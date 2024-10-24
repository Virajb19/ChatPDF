'use client'

import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function LogoutButton() {

 const session = useSession()

 if(!session || !session.data) return null

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