import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs'
import { Readable } from "stream";
import path from 'path'

export async function downloadFromS3(file_key: string): Promise<string | null> {
     try {

        const S3 = new S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
                secretAccessKey:  process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string
            }
        })

        const obj = await S3.send(new GetObjectCommand({
            Bucket:  process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
            Key: file_key
        }))

        const buffer = await streamToBuffer(obj.Body as Readable)
        
        const file_name = path.join(process.cwd(),`/files/pdf-${Date.now()}.pdf`)
        fs.writeFileSync(file_name, buffer)
        return file_name
     } catch(error) {
        console.error('Error downloading from S3 ' + error)
        return null
     }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve,reject) => {
        const chunks: Uint8Array[] = []
        stream.on("data", chunk => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks)))
    })
}