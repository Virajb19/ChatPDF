import { NextRequest, NextResponse } from "next/server";
import { createChatSchema } from "~/lib/zod";
import { db } from "~/server/db";
import { uploadFileToPinecone } from "~/lib/pincone";
import { getFileURL } from "~/lib/s3";
import { getServerAuthSession } from "~/server/auth";
import { storage } from '~/lib/s3-server'

export async function POST(req: NextRequest) {
    try {

        const session = await getServerAuthSession()
        if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
        const user = session.user

        const chats = await db.chat.count({ where: { userId: user.id}})
        
        if(!user.isPro && chats > 7) return NextResponse.json({msg: 'User without pro can only create 7 chats'}, { status: 403})

        if(user.isPro && chats > 20) return NextResponse.json({msg: 'You can not create more than 20 chats'}, { status: 403})

        const parsedData = createChatSchema.safeParse(await req.json())
        if(!parsedData.success) return NextResponse.json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors}, {status: 400})
        const {fileName, fileKey} = parsedData.data

        const fileMetaData = await storage.getFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, fileKey.slice(0,15))
        if(!fileMetaData) return NextResponse.json({msg: 'File not found!'}, { status: 404})

        const fileSize = fileMetaData.sizeOriginal / ( 1024 * 1024)
        if(fileSize > 5) {
            await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, fileKey.slice(0,15))
            return NextResponse.json({ msg: 'File size exceeds 3MB limit'}, { status: 400})
        }

        const fileURL = getFileURL(fileKey)
    
        const chat = await db.chat.create({data: {pdfName: fileName, fileKey, pdfURL: fileURL ,userId: user.id}})

        await uploadFileToPinecone(fileKey)
        // return uploadFileToPinecone(fileKey)
        // .then(() => {
        //     return NextResponse.json({ msg: "Chat created successfully", chatId: chat.id }, { status: 200 });
        // })
        // .catch(async (err) => {
        //     console.error("Error uploading to Pinecone:", err);
        //     await db.chat.delete({ where: { id: chat.id } });

        //     return NextResponse.json({ msg: "Error processing file, chat creation rolled back!" }, { status: 500 });
        // });
        
        return NextResponse.json({msg: 'Chat created successfully', chatId: chat.id}, {status: 200})
    } catch(err) {
        console.error(err)
        return NextResponse.json({msg: 'Error creating chat!'}, {status: 500})
    }
}