'use client'

import {motion} from 'framer-motion'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signup } from '~/actions/signup' 
import { toast } from 'sonner'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import Link from 'next/link';
import { useSession } from 'next-auth/react'
 
interface SignUpData {
    username: string,
    email: string,
    password: string
}

export default function Signup() { 

  const session = useSession()
  // if(status === 'unauthenticated') redirect('/')
 if(session?.data) {
     redirect('/')
 }

  const {register, handleSubmit} = useForm<SignUpData>()
  const [error,setError] = useState<{username?: string[], email?: string[], password?: string[]} | null | undefined>(null)

  const router = useRouter()

  async function onSubmit(data: SignUpData) {
   const result = await signup(data)
    if(!result?.success && result?.errors) {
       setError(result?.errors)
    } else if(!result?.success && result?.error) {
       toast.error(result?.error)
    } else {
        toast.success(result?.msg)
        router.push('/signin')
    }

  }

    return <main className="w-full min-h-screen flex-center bg-black text-white">
               <div id="signup" className="flex flex-col p-2 gap-3 rounded-xl items-center w-[30%] mb:w-[90%] tb:w-1/2 py-5 border">
                     <h2 className="text-center mb:text-5xl tb:text-6xl">Sign up</h2>
                     <form className="flex flex-col p-1 gap-3 w-3/4 mb:w-full items-center" onSubmit={handleSubmit(onSubmit)}>
                           <Input text='username' register={register} errors={error?.username}/>
                           <Input text='email' register={register} errors={error?.email}/>
                           <Input text='password' register={register} errors={error?.password}/>
                            <motion.button onClick={async () => {
                                  
                            }} type='submit' whileHover={{scale: 1.05}} whileTap={{scale: 0.9}} 
                            className="px-7 py-2 bg-white text-black font-bold rounded-full border border-zinc-700 cursor-pointer">Sign up</motion.button>
                     </form>
                     <div className='flex p-1 gap-1 text-sm'>
                       <p>Already has an account ?</p>
                       <Link className='text-blue-500 hover:underline hover:underline-offset-2' href='/signin'>Sign in</Link>
                     </div>
               </div>
        </main>
}

function Input({text, register, errors}: {text: string, register: any, errors: string[] | undefined | null}) {

  const [showPassword,setShowPassword] = useState(false)

    return <div className="relative flex flex-col p-1 gap-1 w-full"> 
      <input {...register(`${text}`)} type={text === 'password' ? (showPassword ? 'text' : 'password') : 'text'} placeholder={text} className="outline-none px-4 py-2 bg-transparent rounded-xl border focus:ring-2 focus:ring-blue-600 focus:border-transparent duration-200" />
      {text === 'password' && <span onClick={() => setShowPassword(!showPassword)} className='absolute p-2 right-2 top-2 cursor-pointer rounded-lg hover:bg-zinc-800 duration-200 text-white'>{showPassword ? <FaRegEyeSlash /> : <FaRegEye />}</span>}
     {errors && 
       <div className='text-red-700 text-left flex flex-col p-1 gap-1 text-sm'>
             {errors?.map((err,i) => {
                return <span key={i}>- {err}</span>
             })}
        </div>}
     </div>
}