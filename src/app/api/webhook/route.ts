import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "~/lib/stripe";
import { db } from "~/server/db";


export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string
    let event: Stripe.Event

    try {
       event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)   
    } catch(error) {
        console.error('Webhook Error: ', error)
        return NextResponse.json({msg: 'Webhook error'}, {status: 500})
    }

    const session = event.data.object as Stripe.Checkout.Session

    if(event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
     if(!session?.metadata?.userId) return NextResponse.json({msg: 'user not found'}, {status: 404})  

     await db.subscription.create({
        data: {
            userId: parseInt(session?.metadata?.userId),
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items?.data[0]?.price.id as string,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
     })
     return NextResponse.json({msg: 'Subscription created successfully'}, {status: 200})
   }

   if(event.type === 'invoice.payment_succeeded') {
     const subscription = await stripe.subscriptions.retrieve(session.subscription as string) 
     const priceId = subscription.items?.data[0]?.price?.id;
     await db.subscription.update({
      where: {
          stripeSubscriptionId: subscription.id,
      },
      data: {
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          stripePriceId: priceId || '',
      },
  });
   }

   return NextResponse.json({msg: 'Subscription updated successfully'}, {status: 200})

}