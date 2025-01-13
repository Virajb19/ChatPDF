'use server'

import { SignUpSchema } from "~/lib/zod"
import bcrypt from 'bcrypt'
import { db } from "~/server/db"
import { z } from 'zod'
import { Role } from '@prisma/client'
import { getServerAuthSession } from "./auth"
import Stripe from "stripe"
import { redirect } from "next/navigation"

type formData = z.infer<typeof SignUpSchema>

export async function signup(formData: formData) {
    try {
       const parsedData = SignUpSchema.safeParse(formData)
       if(!parsedData.success) return {success: false, errors: parsedData.error.flatten().fieldErrors, msg: 'Invalid inputs'}
       const {username, email, password} = parsedData.data
   
       const userExists = await db.user.findFirst({where: {OR: [{email}, {username}]}})
       if(userExists) return {success: false, msg: 'user already exists'}
   
       const hashedPassword = await bcrypt.hash(password,10)
       await db.user.create({data: {username,email,password: hashedPassword}})
   
       return {success: true, msg: 'Signed up successfully. Welcome to GitChat !!!'}
   } catch(e) {
       console.error('Error while signing up',e)
       return {success: false, msg: 'Something went wrong !!!'}
    }
}

export async function saveMessage(content: string, chatId: string, role: Role) {
    try {
        await db.message.create({data: { content, chatId, role}})
    } catch(err) {
        console.error('Error saving message: ', err)
    }
}


export async function createCheckoutSession() {
    const authSession = await getServerAuthSession()
    if(!authSession?.user) throw new Error('Unauthorized')
        const userId = authSession.user.id
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-09-30.acacia'})
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `ChatPDF`
                    },
                    unit_amount: 2000
                }, 
                quantity: 1
            }
        ],
        customer_creation: 'always',
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        client_reference_id: userId.toString(),
    })

    return redirect(session.url!)
}

