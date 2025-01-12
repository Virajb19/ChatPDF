'use server'

import { SignUpSchema } from "~/lib/zod"
import bcrypt from 'bcrypt'
import { db } from "~/server/db"
import { z } from 'zod'
import { getServerAuthSession } from "./auth"
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { getContext } from "~/lib/context"
import { Role } from '@prisma/client'

type formData = z.infer<typeof SignUpSchema>

export async function signup(formData: formData) {
    try {
       const parsedData = SignUpSchema.safeParse(formData)
       if(!parsedData.success) return {success: false, errors: parsedData.error.flatten().fieldErrors, msg: 'Invalid inputs'}
       const {username, email, password} = parsedData.data
   
       const userExists = await db.user.findFirst({where: {OR: [{email}, {username}]}})
       if(userExists) return {success: false, msg: 'user already exists'}
   
       const hashedPassword = await bcrypt.hash(password,10)
       await db.user.create({data: {username,email,password: hashedPassword}})
   
       return {success: true, msg: 'Signed up successfully. Welcome to GitChat !!!'}
   } catch(e) {
       console.error('Error while signing up',e)
       return {success: false, msg: 'Something went wrong !!!'}
    }
}

export async function saveMessage(content: string, chatId: string, role: Role) {
    try {
        await db.message.create({data: { content, chatId, role}})
    } catch(err) {
        console.error('Error saving message: ', err)
    }
}

export async function deleteChats() {
    const session = await getServerAuthSession()
    const userId = session?.user.id

    await db.chat.deleteMany({ where: {userId}})
}

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string})

export async function generateResponse(message: string, chatId: string) {
   const stream = createStreamableValue()

   const context = await getContext(message, chatId);

   (async () => {
       const { textStream } = await streamText({
          model: google('gemini-1.5-flash'),
          prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
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
        AI
        assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        the context does not provide the answer to question, the AI assistant will sag,
        "I'm sorry, but I don't know the aru
        assistant will not apologize for previous responses, but instead will indicated new information was gained.
        assistant will not invent anything that is not drawn directly from the context.
      ` 
       })


       for await (const text of textStream) {
        stream.update(text)
       }

       stream.done()
   }) ()

   return {
    output: stream.value,
  }
}