import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Get the current session on the server side
 */
export async function getSession() {
  return getServerSession(authOptions)
}

/**
 * Get the current user on the server side
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

