import { GoogleGenerativeAI } from '@google/generative-ai'
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'text-embedding-004'})

export async function getEmbeddings(text: string) {
      const result = await model.embedContent(text)
      return result.embedding.values as number[]
} 

// import { embed } from "ai"
// import { createGroq } from "@ai-sdk/groq"

// const groq = createGroq({
//   apiKey: process.env.GROQ_API_KEY!,
// })

// export async function getEmbeddings(text: string) {
//   const { embedding } = await embed({
//     model: groq.embeddingModel("text-embedding-3-small") as any,
//     value: text,
//   })

//   return embedding
// }


