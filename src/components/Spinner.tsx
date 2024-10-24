import { LoaderCircle } from 'lucide-react';

export default function Spinner() {
 return <main className="w-full min-h-screen flex-center bg-gradient-to-r from-rose-200 to-teal-200 text-black">
           <span className='animate-spin'><LoaderCircle className='size-10' /></span>
        </main>
}