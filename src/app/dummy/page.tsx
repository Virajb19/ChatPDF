
import { getServerAuthSession } from "~/server/auth"

export default async function page() {
  
    const session = await getServerAuthSession()

    return <main className="w-full min-h-screen bg-black text-white flex-center">
           {JSON.stringify(session)}
        </main>
}
