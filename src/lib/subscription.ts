'use server'

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function checkSubscription() {
    const session = await getServerAuthSession()
    const userId = parseInt(session?.user.id as string)
    if(!userId) return false

    const userSubscriptions = await db.subscription.findMany({where: {userId}})
    if(!userSubscriptions[0]) return false

    const userSubscription = userSubscriptions[0]

    const isValid = userSubscription.stripePriceId && (userSubscription.stripeCurrentPeriodEnd.getTime() + 1000 * 60 * 60 * 24) > Date.now()
    return !!isValid
}