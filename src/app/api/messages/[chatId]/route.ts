import { NextRequest, NextResponse } from "next/server";
import { createMessageSchema } from "~/lib/zod";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { getContext } from "~/lib/context";

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
    try {

        const session = await getServerAuthSession()
        if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})

        const { chatId } = params

        const chat = await db.chat.findUnique({ where: { id: chatId}, select: {id: true}})
        if(!chat) return NextResponse.json({msg: 'chat not found'}, { status: 404})

        const messages = await db.message.findMany({ where: {chatId}, orderBy: { createdAt: 'asc'}})

        return NextResponse.json({messages}, { status: 200})
    } catch(err) {
        console.error(err) 
        return NextResponse.json({msg: 'Error fetching messages'}, { status: 500})
    }
}

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
   try {
        const session = await getServerAuthSession()
        if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})

        const parsedData = createMessageSchema.safeParse(await req.json())
        if(!parsedData.success) return NextResponse.json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors}, { status: 401})
        
        const { message } = parsedData.data


        const { chatId } = params

        const chat = await db.chat.findUnique({ where: { id: chatId}, select: {id: true}})
        if(!chat) return NextResponse.json({msg: 'chat not found'}, { status: 404})

        await db.message.create({data: {content: message, chatId, role: 'USER'}})
    
   } catch(err) {
      console.error(err)
      return NextResponse.json({msg: 'Internal server error'}, { status: 500})
   }
}