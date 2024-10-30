import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { db } from "~/server/db";

const return_url = process.env.NEXT_BASE_URL + '/'

export async function GET(req: NextRequest) {
   try {

    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
    if(!token) return NextResponse.json({msg: 'Unauthorized'}, { status: 401})
    const userId = parseInt(token.sub as string)

    const userSubscriptions = await db.subscription.findMany({where: {userId}})
    
    if(userSubscriptions[0] && userSubscriptions[0].stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscriptions[0].stripeCustomerId,
            return_url
        })
       return NextResponse.json({url: stripeSession.url}, {status: 200})
    }

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: return_url,
        cancel_url: return_url,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: token.email as string,
        line_items: [
            {
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: 'ChatPDF pro',
                        description: 'Unlimited PDF sessions!'
                    },
                    unit_amount: 2000,
                    recurring: {
                        interval: 'month'
                    }
                },
                quantity: 1
            }
        ],
        metadata: {
            userId
        }
    })

    return NextResponse.json({url: stripeSession.url}, { status: 200})

   } catch(error) {
      console.error('Stripe error :', error)
      return NextResponse.json({msg: 'Internal server error'}, { status: 500})
   }
}