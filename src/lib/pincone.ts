
import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFile } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5'
import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { convertToASCII } from './utils';
import fs from 'fs'

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

export async function uploadFileToPinecone(fileKey: string) {
  
  try {

      //  const fileName = await downloadFile(fileKey)

       const fileBuffer = await downloadFile(fileKey)
       const fileBlob = new Blob([fileBuffer], { type: 'application/pdf'})
       
      //  const loader = new PDFLoader(fileName as string)
       const loader = new WebPDFLoader(fileBlob, { splitPages: true})
       const pages = (await loader.load()) as PDFDocument[]
       
       const documents = await Promise.all(pages.map(page => prepareDocument(page)))

       const vectors = await Promise.all(documents.flat().map(doc => embedDocument(doc)))

       const pc = await getPineconeClient()
       const pineconeIndex = pc.index('chatpdf')
       const namespace = convertToASCII(fileKey)
      
      await pineconeIndex.namespace(namespace).upsert(vectors as any)

      // fs.unlink(fileName, (err) => {
      //    if(err) console.error(err)
      // })

} catch(error) {
        console.error('Error occured while uploading to Pinecone \n' + error)
        throw error
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

        return {id: hash, values: embeddings, metadata: { text: doc.metadata.text, pageNumber: doc.metadata.pageNumber}} as Vector
       
     } catch(error) {
        console.error('Error in embedDocument\n' + error)
     }
}

export async function truncateStringByBytes(str: string, bytes: number) {
   const enc = new TextEncoder()
   return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}