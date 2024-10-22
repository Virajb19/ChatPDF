import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { db } from "~/server/db"
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInSchema } from "~/lib/zod";
import bcrypt from 'bcrypt'

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    jwt: async ({token, user}) => {
        console.log(token)
        console.log(user)
        token.userId = user.id
        return token
    }
  },
  providers: [
     CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email',type: 'text',placeholder: 'email'},
        password: {label: 'password', type: 'password', placeholder: 'password'}
      },
       authorize: async ({email, password}: {email: string, password: string}) => {
        const parsedData = SignInSchema.safeParse({email,password})
        if(!parsedData.success) throw new Error('Invalid Credentials. try again !')

        const user = await db.user.findUnique({where: {email}})
        const isMatch = await bcrypt.compare(password,user?.password || '')     
        if(!user || !isMatch) throw new Error ('Incorrect credentials')

        return {id: user.id, username: user.username, email: user.email}
      }
     })
  ],
  pages: {
    signIn: '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret'
}

export const getServerAuthSession = () => getServerSession(authOptions)
