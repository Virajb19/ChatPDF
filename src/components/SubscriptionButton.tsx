'use client'

import { useState } from "react"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import { createCheckoutSession } from "~/server/actions"
import { Zap } from 'lucide-react'

export default function SubscriptionButton({isPro}: {isPro: boolean}) {

  const [isLoading, setIsLoading] = useState(false)

    return <button disabled={isLoading} onClick={() => {
      setIsLoading(true)
      const id = toast.loading('Directing to Stripe page...')
      createCheckoutSession().then(res => toast.success('Directed')).catch(err => {
        console.error(err)
        toast.error('Something went wrong')
      }).finally(() => {
        setIsLoading(false)
        toast.dismiss(id)
      })
    }} className={twMerge("px-4 py-2 flex-center gap-3 font-semibold bg-black dark:bg-white text-white dark:text-black rounded-lg disabled:cursor-not-allowed disabled:opacity-80")}>
        {/* {isPro ? "Manage Subscriptions" : "Go to pro !"} */}
       <Zap className="text-green-600 fill-green-600"/> Upgrade
    </button>
}