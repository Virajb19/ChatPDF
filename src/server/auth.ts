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
    jwt: async ({token, user, session}) => {
       console.log("Jwt callback",{token, user, session})
       return token
    },
    session: async ({session, token ,user}) => {
      console.log("session callback",{token, user, session})
      return session
    }
  },
  providers: [
     CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email',type: 'text',placeholder: 'email'},
        password: {label: 'password', type: 'password', placeholder: 'password'}
      },
       authorize: async (credentials: any) => {

        if (!credentials) {
          throw new Error("No credentials provided")
        }

        const {email,password} = credentials

        const parsedData = SignInSchema.safeParse({email,password})
        if(!parsedData.success) throw new Error('Invalid Credentials. try again !')

        const user = await db.user.findUnique({where: {email}})
        if(!user) throw new Error('User not found. check email !')
        const isMatch = await bcrypt.compare(password, user.password)     
        if(!isMatch) throw new Error('Check your password !!!')

        return {id: user.id.toString(), username: user.username, email: user.email}
      }
     })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret'
}

export const getServerAuthSession = () => getServerSession(authOptions)
