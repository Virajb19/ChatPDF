import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { groq } from "@ai-sdk/groq";
import { getContext } from "~/lib/context";
import type { UIMessage } from "ai";
import { getServerAuthSession } from "~/server/auth";

export const maxDuration = 30

type ChatMetadata = {
  chatID: string
}

function getText(message: UIMessage): string {
  return message.parts.filter(p => p.type === 'text').map(p => p.text).join('')
}

export async function POST(req: NextRequest) {

 try {
    const {messages}:  { messages: UIMessage<ChatMetadata>[] } = await req.json()

    const lastMessage = messages[messages.length - 1]

    if(!lastMessage) return NextResponse.json({msg: 'No messages provided'}, { status: 400})
      
    const chatID = lastMessage.metadata?.chatID
    if(!chatID) return NextResponse.json({msg: 'ChatId missing in metadata'}, { status: 400})

    const userText = getText(lastMessage)
        
    const chat = await db.chat.findUnique({where: {id: chatID}})
    if(!chat) return NextResponse.json({msg: 'Chat not found'}, {status: 404})

    const role = lastMessage?.role === 'assistant' ? 'ASSISTANT' : 'USER'
    await db.message.create({data: {content: userText, chatId: chatID, role}})

    const context = await getContext(userText, chat.fileKey)

    // console.log('Context', context)

    const prompt = {
      role: 'system' as const,
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.

        1. **Use numbered lists** when listing multiple points.
        2. **Use headings** (e.g., '###') for different sections.
        3. **Use bullet points** when listing subpoints.
        4. **Keep responses concise and well-structured**.
        5. **Use bold text** for important terms.
        
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCKf
      AI
      If
      AI
      assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      the context does not provide the answer to question, the AI assistant will sag,
      "I'm sorry, but I don't know the aru
      assistant will not apologize for previous responses, but instead will indicated new information was gained.
      assistant will not invent anything that is not drawn directly from the context.

      Provide more structured response like when you provide points add number in front of them.
      Dont say this line -> This information is based on the provided context block.
      `     
    }

  const result = streamText({
      model: groq('llama-3.3-70b-versatile') as any,
      system: prompt,
      messages: await convertToModelMessages(messages),    
      onChunk: async () => {
          await new Promise(r => setTimeout(r, 25))
      }
  })

    // console.log(result)

     return result.toUIMessageStreamResponse()
  } catch(error) {
    console.error(error)
    return NextResponse.json({msg: 'Internal server error'}, { status: 500})
  } 
} 

export async function GET(req: NextRequest) {
   try {
      const session = await getServerAuthSession()
      if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
      const userId = session.user.id

      const chatCount = await db.chat.count({ where: {userId}})

      return NextResponse.json({chatCount}, { status: 200})
   } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Internal server error'}, { status: 500})
   }
}
