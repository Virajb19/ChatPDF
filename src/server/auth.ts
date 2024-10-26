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
      //  console.log("Jwt callback",{token, user, session})
       if(user) {
         token.name = user.name
         token.id = token.sub
       }
       return token
    },
    session: async ({session, token ,user}) => {
      // console.log("session callback",{token, user, session})
      if(session && session.user) {
        session.user.name = token.name
        session.user.id = token.sub as string
      }
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
    try {
        if (!credentials) {
          throw new Error("No credentials provided")
        }

        const {email,password} = credentials

        const parsedData = SignInSchema.safeParse({email,password})
        if(!parsedData.success) throw new Error('Invalid Credentials. try again !')
        // PRISMA ERROR WITHOUT TRY CATCH
        const user = await db.user.findUnique({where: {email}})
        if(!user) throw new Error('User not found. check email !')
        const isMatch = await bcrypt.compare(password, user.password)     
        if(!isMatch) throw new Error('Check your password !!!')

        return {id: user.id.toString(), name: user.username, email: user.email}
} catch(e) {
  console.error(e)
  if(e instanceof Error) throw new Error(e.message)
  else { throw new Error('Something went wrong !!!')}
}
      }
     })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 24 * 60 * 60
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'secret'
  },
  pages: {
    signIn: '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret'
}

export const getServerAuthSession = () => getServerSession(authOptions)
