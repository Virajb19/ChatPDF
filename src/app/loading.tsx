import { Loader } from 'lucide-react';

export default function Loading() {
    return <main className="w-full min-h-screen flex-center text-green-500">
            <Loader className='size-20 animate-spin' />
        </main> 
}