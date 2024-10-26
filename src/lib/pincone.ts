'use server'

import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import fs from 'fs'
import pdf from 'pdf-parse'

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
     console.log(file_name)

    //  try {
      
    //     const buffer = fs.readFileSync(file_name as string)
    //     const data = await pdf(buffer)
    //     console.log(data.text)

    //  } catch(error) {
    //     console.error(error)
    //  }
}