import { NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"

export async function GET(req: NextRequest) {
    try {
       const session = await getServerAuthSession()
       if(!session?.user) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
       const userId = session.user.id
 
       const chats = await db.chat.findMany({ where: { userId }, orderBy: { createdAt: 'asc'}})
 
       return NextResponse.json({chats}, { status: 200})
    } catch(err) {
       console.error('Error getting chats',err)
       return NextResponse.json({msg: 'Internal server error'}, { status: 500})
    }
 }
 