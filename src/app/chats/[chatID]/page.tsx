import { redirect, notFound } from "next/navigation"
import ChatComponent from "~/components/ChatComponent"
import ChatSideBar from "~/components/ChatSideBar"
import PDFViewer from "~/components/PDFViewer"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

export default async function ChatPage({ params : { chatID }} : { params: { chatID: string}}) {

   const session = await getServerAuthSession()
   if(!session?.user) return redirect('/signin')

  const chats = await db.chat.findMany({where: {userId: session.user.id}})
  if(!chats) return redirect('/')

  const current_chat = chats.find(chat => chat.id === chatID)
  if(!current_chat) return notFound()

  // console.log(current_chat)
  // console.log(session)
  
    return <>
       <main className="w-full mb:hidden h-screen flex overflow-hidden">
              <ChatSideBar chats={chats} chatID={chatID}/>
            <div className="min-h-screen w-1/2 flex-center">
            <PDFViewer pdfURL={current_chat.pdfURL || ""}/>
              </div>
              <ChatComponent chatID={chatID}/>
        </main>

        <main className="sm:hidden pt-20">
             <ChatComponent chatID={chatID}/>
        </main>
    </>
}