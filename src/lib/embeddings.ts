import { GoogleGenerativeAI } from '@google/generative-ai'
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export async function getEmbeddings(text: string) {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004'})
      const result = await model.embedContent(text)
      return result.embedding.values as number[]
} 