import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export const config = {
    matcher: ['/api/create-chat', '/chats']
}

export default withAuth((req) => {
    const token = req.nextauth.token
    if(!token) return NextResponse.redirect(new URL('/signin', req.url))
    //@ts-ignore
    req.userId = parseInt(token.sub)
}) 