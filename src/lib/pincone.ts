
import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5'
import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { convertToASCII } from './utils';

type PDFDocument = {
    pageContent: string;
    metadata: {
      source: string;
      pdf: {
        version: string;
        info: Record<string, any>;
        metadata: any | null;
        totalPages: number;
      };
      loc: {
        pageNumber: number;
      };
    };
    id?: string;
  };
  

let pc: Pinecone | null = null

export async function getPineconeClient() {
    if(!pc) {
        pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY as string
        })
    }
    return pc
}

export async function uploadS3ToPinecone(file_key: string) {

     const file_name = await downloadFromS3(file_key)

try {
       const loader = new PDFLoader(file_name as string)
       const pages = (await loader.load()) as PDFDocument[]
       
       const documents = await Promise.all(pages.map(page => prepareDocument(page)))

       const vectors = await Promise.all(documents.flat().map(doc => embedDocument(doc)))

       const pc = await getPineconeClient()
       const pineconeIndex = pc.index('chatpdf')
       const namespace = convertToASCII(file_key)
      
      pineconeIndex.namespace(namespace).upsert(vectors as any)

} catch(error) {
        console.error('Error occured in pincone.ts \n' + error)
     }
}

export async function prepareDocument(page: PDFDocument){
    let { pageContent, metadata} = page
    pageContent = pageContent.replace(/\n/g, ' ')

    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: await truncateStringByBytes(pageContent, 36000)
            }
        })
    ])

    return docs
} 

export async function embedDocument(doc: Document) {
     try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)

        // console.log(doc.metadata)

        return {id: hash, values: embeddings, metadata: { text: doc.metadata.text, pageNumber: doc.metadata.pageNumber}} as Vector
       
     } catch(error) {
        console.error('Error in embedDocument\n' + error)
     }
}

export async function truncateStringByBytes(str: string, bytes: number) {
   const enc = new TextEncoder()
   return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}