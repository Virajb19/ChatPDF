import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { CoreMessage, streamText } from 'ai'

const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string})

export async function getResponse(context: string) {
    const stream = createStreamableValue();

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
  
        Provide more structured response like when you provide points add number in front of them.
        `     
      };

    (async () => {
       
      const { textStream } = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [prompt]
      })

        for await (const text of textStream) {
            stream.update(text)
        }

        stream.done()

    }) ()

    return { output: stream.value }
}