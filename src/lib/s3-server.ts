import { Client, Storage} from 'node-appwrite'
import fs from 'fs'

const secretKey = process.env.APPWRITE_SECRET_KEY ?? ''

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('678214740011efc3b8ec')
    .setKey(secretKey)

export const storage = new Storage(client)

export async function downloadFile(fileKey: string) {

   const result = await storage.getFileDownload('6782148a002e26893ddb', fileKey.slice(0,15))

   const buffer = Buffer.from(result)
   const fileName = process.cwd() +  `/files/${fileKey}`

   fs.writeFileSync(fileName, buffer)
   return fileName
}
