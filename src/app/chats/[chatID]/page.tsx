import { redirect, notFound } from "next/navigation"
import ChatComponent from "~/components/ChatComponent"
import ChatSideBar from "~/components/ChatSideBar"
import PDFViewer from "~/components/PDFViewer"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

export default async function ChatPage({ params : { chatID }} : { params: { chatID: string}}) {

   const session = await getServerAuthSession()
   if(!session?.user) return redirect('/signin?reason=auth')

  const chats = await db.chat.findMany({where: {userId: session.user.id}, orderBy: {createdAt: 'asc'}})
  if(!chats) return redirect('/')

  // Add userId to ensure chat belongs to right user
  // What if another logged in user copies the chatId of yours and paste /chats/:chatId url in his browser?
  // He will be able to see your chat
  // Also add this check in API although this is server side 
  const chat = await db.chat.findUnique({where: {id: chatID, userId: session.user.id}})
  if(!chat) return notFound()

  const current_chat = chats.find(chat => chat.id === chatID)
  if(!current_chat) return notFound()
  
    return <>
       <main className="w-full mb:hidden h-screen flex overflow-hidden">
              <ChatSideBar chats={chats} chatID={chatID} isPro={session.user.isPro}/>
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