import { NextRequest, NextResponse } from "next/server";
import { createMessageSchema } from "~/lib/zod";
import { db } from "~/server/db";
import { streamText, convertToCoreMessages, CoreMessage } from 'ai';
import { google } from '@ai-sdk/google'
import { getContext } from "~/lib/context";
import { saveMessage } from "~/server/actions";
import { Message } from "ai";

export async function POST(req: NextRequest) {

 try {
    const {messages, chatID} = await req.json()

    const lastMessage = messages[messages.length - 1]

    await db.message.create({data: {content: lastMessage.content, chatId: chatID, role: lastMessage.role}})

    const chat = await db.chat.findUnique({where: {id: chatID}})
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
