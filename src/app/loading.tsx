import { Loader } from 'lucide-react';

export default function Loading() {
    return <main className="w-full min-h-screen flex-center from-rose-500 to-teal-400 text-black">
            <Loader className='size-20 animate-spin' />
        </main> 
}