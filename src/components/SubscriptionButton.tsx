import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export default function SubscriptionButton({isPro}: {isPro: Boolean}) {

    const [loading,setLoading] = useState<boolean>(false)

    async function handleSubcription() {
        const toastId = toast.loading('Directing to stripe page...')
      try {
        setLoading(true)
        // await new Promise(res => setTimeout(res,10000))
        const response = await axios.get('/api/stripe')
        window.location.href = response.data.url
        // toast.dismiss(toastId)
      } catch(err) {
         toast.error('Something went wrong. Try again !!!')
      } finally {
        setLoading(false)
        toast.dismiss(toastId)
      }
    }

    return <button disabled={loading} onClick={handleSubcription} className={twMerge("bg-white text-black px-4 py-2 font-semibold rounded-lg", loading && "cursor-not-allowed text-gray-500")}>
        {isPro ? "Manage Subscriptions" : "Go to pro !"}
    </button>
}