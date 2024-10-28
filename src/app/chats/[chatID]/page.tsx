import { redirect } from "next/navigation"
import ChatSideBar from "~/components/ChatSideBar"
import PDFViewer from "~/components/PDFViewer"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

export default async function ChatPage({ params : { chatID }} : { params: { chatID: string}}) {

   const session = await getServerAuthSession()
   if(!session?.user) return redirect('/signin')

  const chats = await db.chat.findMany({where: {userId: parseInt(session?.user.id)}})
  if(!chats) return redirect('/')

  const current_chat = chats.find(chat => chat.id === chatID)
  if(!current_chat) return redirect('/')

    return <main className="w-full min-h-screen flex gap-1 text-white">
              <ChatSideBar chats={chats} chatID={chatID}/>
              <PDFViewer pdfURL={current_chat.pdfURL as string}/>
        </main>
}