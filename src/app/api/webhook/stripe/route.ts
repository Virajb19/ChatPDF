import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe'
import { db } from "~/server/db";

export async function POST(req: NextRequest) {

    const body = await req.text()
    const signature = (headers()).get('Stripe-Signature') as string
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-09-30.acacia'})
    let event: Stripe.Event

    try {
       event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch(err) {
         return NextResponse.json({msg: 'Internal signature'}, { status: 500})
    }

    const session = event.data.object as Stripe.Checkout.Session

    if(event.type === 'checkout.session.completed') {
        const userId = Number(session.client_reference_id)
        if(!userId) return NextResponse.json({msg: 'Missing userId'}, { status: 404})

        await db.user.update({where: {id: userId}, data: {isPro: true}})

        return NextResponse.json({msg: 'upgraded successfully'}, { status: 200})
    }
    return NextResponse.json({msg: 'Internal server error'}, { status: 500})
  }