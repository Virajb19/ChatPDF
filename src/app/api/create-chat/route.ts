import { NextRequest, NextResponse } from "next/server";
import { createChatSchema } from "~/lib/zod";
import { getToken } from "next-auth/jwt"
import { db } from "~/server/db";
import { uploadS3ToPinecone } from "~/lib/pincone";
import { getS3Url } from "~/lib/s3";

export async function POST(req: NextRequest) {
    try {
        const parsedData = createChatSchema.safeParse(await req.json())
        if(!parsedData.success) return NextResponse.json({msg: 'Invalid credentials', errors: parsedData.error.flatten().fieldErrors}, {status: 400})
        const {pdfName, fileKey} = parsedData.data
    
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
        if(!token) return NextResponse.json({msg: 'Unauthorized'}, {status: 401})
        const userId = parseInt(token.sub as string)

        const chat = await db.chat.create({data: {pdfName, fileKey, pdfURL: getS3Url(fileKey) ,userId}})

        await uploadS3ToPinecone(fileKey)

        return NextResponse.json({msg: 'Chat created successfully', chatId: chat.id}, {status: 200})
    } catch(e) {
        console.error(e)
        return NextResponse.json({msg: 'Something went wrong !'}, {status: 500})
    }
}