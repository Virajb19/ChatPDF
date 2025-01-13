import { NextRequest, NextResponse } from "next/server";
import { createChatSchema } from "~/lib/zod";
import { db } from "~/server/db";
import { uploadFileToPinecone } from "~/lib/pincone";
import { getFileURL } from "~/lib/s3";
import { getServerAuthSession } from "~/server/auth";

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

        const fileURL = getFileURL(fileKey)
    
        const chat = await db.chat.create({data: {pdfName: fileName, fileKey, pdfURL: fileURL ,userId: user.id}})

        await uploadFileToPinecone(fileKey)
        
        return NextResponse.json({msg: 'Chat created successfully', chatId: chat.id}, {status: 200})
    } catch(err) {
        console.error(err)
        return NextResponse.json({msg: 'Error creating chat!'}, {status: 500})
    }
}