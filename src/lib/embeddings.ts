// import { GoogleGenerativeAI } from '@google/generative-ai'
 
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
// const model = genAI.getGenerativeModel({ model: 'text-embedding-004'})

// export async function getEmbeddings(text: string) {
//       const result = await model.embedContent(text)
//       return result.embedding.values as number[]
// } 

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL!, // for client side env vars start with -> NEXT_PUBLIC
    "X-Title": "ChatPDF",                   
  },
})

export async function getEmbeddings(text: string) {
    const response = await client.embeddings.create({
       model: 'intfloat/e5-base-v2',
       input: `passage: ${text}`
    })

    const embedding = response.data[0]?.embedding

    if(!embedding) throw new Error('Failed to generate embedding')
    return embedding
}



