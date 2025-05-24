import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'

export function signToken(user: any) {
  return jwt.sign({ id: user.id, role: user.roles_id }, JWT_SECRET, { expiresIn: '7d' })
}

export async function getUserFromToken(): Promise<{ id: number; role: number; } | null> {
  const token = (await cookies()).get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            role: true
          }
        })

        if (!user) {
          throw new Error('Utilisateur non trouvé')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect')
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          role: user.role.role_name,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id 
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}




