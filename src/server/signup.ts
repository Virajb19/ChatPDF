'use server'

import { signUpSchema } from "~/lib/zod"
import bcrypt from 'bcrypt'
import { db } from "./db"

interface formData {
    username: string
    email: string
    password: string
}

export async function signup(formData: formData) {

    const parsedData = signUpSchema.safeParse(formData)
    if(!parsedData.success) return {success: false, errors: parsedData.error.flatten().fieldErrors}
    const {username, email, password} = parsedData.data

  const userExists = await db.user.findFirst({where: {OR: [{email}, {username}]}})
  if(userExists) return {success: false, error: 'user already exists'}

  const hashedPassword = await bcrypt.hash(password,10)
  await db.user.create({data: {username,email,password: hashedPassword}})

  return {success: true, msg: 'Signed up successfully'}

}