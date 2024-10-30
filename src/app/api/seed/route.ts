import { db } from "~/server/db"


async function main() {
 for(let i=0; i < 10 ; i++) {
    await db.message.create({data: {content: 'Hi! I am fine', chatId: 'cm2sojvka000lvsyf5gd0uw5z', role: 'ASSISTANT'}})
    await db.message.create({data: {content: 'Hello! How are you', chatId: 'cm2sojvka000lvsyf5gd0uw5z', role: 'USER'}})
 }
}

main()