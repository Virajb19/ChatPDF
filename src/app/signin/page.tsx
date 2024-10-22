'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SignInData {
    email: string,
    password: string
}

export default function Page() {

    const {register, handleSubmit} = useForm<SignInData>()
    const [error,setError] = useState<{username?: string[], email?: string[], password?: string[]} | null | undefined>(null)
    const router = useRouter()

    async function OnSubmit(data: SignInData) {
        const loadId = toast.loading('Signing in...')
        const result = await signIn('credentials',{email: data.email, password: data.password, redirect: false})
        console.log(result)
        toast.dismiss(loadId)
        if(!result?.error) {
            router.push('/')
            toast.success('Signed in successfully')
        }
        toast.error(result?.error, {duration: 3000})
    }
    
    return <main className="w-full min-h-screen flex-center bg-black text-white">
               <div id="signup" className="flex flex-col p-2 gap-3 rounded-xl items-center w-[30%] mb:w-[90%] tb:w-1/2 py-5 border">
                     <h2 className="text-center mb:text-5xl tb:text-6xl">Sign in</h2>
                     <form className="flex flex-col p-1 gap-3 w-3/4 mb:w-full items-center" onSubmit={handleSubmit(OnSubmit)}>
                           <Input text='email' register={register} errors={error?.email}/>
                           <Input text='password' register={register} errors={error?.password}/>
                            <motion.button type='submit' whileHover={{scale: 1.05}} whileTap={{scale: 0.9}} 
                            className="px-7 py-2 bg-white text-black font-bold rounded-full border border-zinc-700 cursor-pointer">Sign in</motion.button>
                     </form>
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
                return <span key={i}>{err}</span>
             })}
        </div>}
     </div>
}