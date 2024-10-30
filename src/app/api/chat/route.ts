import { NextRequest, NextResponse } from "next/server";
import { createMessageSchema } from "~/lib/zod";
import { db } from "~/server/db";
import { streamText, convertToCoreMessages, CoreMessage } from 'ai';
import { google } from '@ai-sdk/google'
import { getContext } from "~/lib/context";

// export const runtime = 'edge'

export async function POST(req: NextRequest) {

 try {
    const {messages, chatID} = await req.json()

    const secondLastMessage = messages[messages.length - 2]
    const lastMessage = messages[messages.length - 1]

    const chat = await db.chat.findUnique({where: {id: chatID}})
    if(!chat) return NextResponse.json({msg: 'Chat not found'}, {status: 404})
    const context = await getContext(lastMessage.content, chat?.fileKey as string)

    console.log(context)

    const prompt: CoreMessage = {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK
      AI
If
AI
AI
assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
the context does not provide the answer to question, the AI assistant will sag,
"I'm sorry, but I don't know the aru
assistant will not apologize for previous responses, but instead will indicated new information was gained.
assistant will not invent anything that is not drawn directly from the context.
      `     
    }

    const result = await streamText({
      model: google('gemini-1.5-pro'),
      messages: [prompt, ...convertToCoreMessages(messages)],
  })

    const parsedData = createMessageSchema.safeParse(lastMessage)
    if(!parsedData.success) return NextResponse.json({msg: 'Invalid message'}, {status: 400}) 

    await db.$transaction(async (tx) => {
        if(secondLastMessage) await tx.message.create({data: { content: secondLastMessage.content, role: secondLastMessage.role.toUpperCase(), chatId: chatID}})
        await tx.message.create({data: {content: lastMessage.content, role: lastMessage.role.toUpperCase(), chatId: chatID} })
    })

    return result.toDataStreamResponse()
  } catch(error) {
    console.error(error)
    return NextResponse.json({msg: 'Internal server error'}, { status: 500})
  } 
} 
