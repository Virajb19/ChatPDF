import { LoaderCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Spinner({color}: {color: string}) {
    return <span className={twMerge('animate-spin', color)}><LoaderCircle className='size-10' /></span>    
}