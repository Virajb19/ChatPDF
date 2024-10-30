import { Pinecone } from "@pinecone-database/pinecone";
import { convertToASCII } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchingsFromEmbeddings(embeddings: number[], fileKey: string) {
try {
   const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string
   })

   const index = pc.Index('chatpdf') 
   const namespace = convertToASCII(fileKey)
   const queryResult = await index.namespace(namespace).query({
       topK: 5,
       vector: embeddings,
       includeMetadata: true,
   })
    return queryResult.matches || []
  } catch(error) {
    console.error('Error while querying embeddings', error)
  }
}


export async function getContext(query: string, fileKey: string) {
try{
     const queryEmbeddings = await getEmbeddings(query)
     const matches = await getMatchingsFromEmbeddings(queryEmbeddings, fileKey)
      
     const qualifyingDocs = matches?.filter(match => match.score && (match.score > 0.3))
     type Metadata = { text: string, pageNumber: number}

     //Extract text from metadata
     const docs = qualifyingDocs?.map(match => (match.metadata as Metadata).text)
     return docs?.join('\n').substring(0,3000)
  } catch(error) {
    console.error('Error while getting context', error)
  }
}