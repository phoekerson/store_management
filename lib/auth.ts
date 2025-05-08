import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

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
