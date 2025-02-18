import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { streamText, convertToCoreMessages, CoreMessage } from 'ai';
import { google } from '@ai-sdk/google'
import { getContext } from "~/lib/context";
import { Message } from "ai";
import { getServerAuthSession } from "~/server/auth";


export async function POST(req: NextRequest) {

 try {
    const {messages, chatID} = await req.json()

    const lastMessage: Message = messages[messages.length - 1]

    const role = lastMessage.role === 'assistant' ? 'ASSISTANT' : 'USER'
    await db.message.create({data: {content: lastMessage.content, chatId: chatID, role}})

    const chat = await db.chat.findUnique({where: {id: chatID as string}})
    if(!chat) return NextResponse.json({msg: 'Chat not found'}, {status: 404})
    const context = await getContext(lastMessage.content, chat.fileKey)

    const prompt: CoreMessage = {
      role: 'system',
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
      `     
    }

  const result = await streamText({
      model: google('gemini-1.5-pro'),
      messages: [prompt, ...convertToCoreMessages(messages)],
      
  })

    return result.toDataStreamResponse()

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

      const chatCount = await db.chat.count({ where: { userId}})

      return NextResponse.json({chatCount}, { status: 200})
   } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Internal server error'}, { status: 500})
   }
}
