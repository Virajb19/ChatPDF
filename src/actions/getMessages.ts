'use server'
import { db } from "~/server/db"

export async function getMessages(chatId: string) {
     const messages = await db.message.findMany({where: {chatId}})
     return messages
}