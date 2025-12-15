import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { supabase } from '@/lib/supabase'
import { verifyPassword, hashPassword } from '@/lib/auth-utils'

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user in Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          throw new Error('Invalid email or password')
        }

        if (!user.password_hash) {
          throw new Error('Please sign in with your OAuth provider')
        }

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.password_hash)
        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        // Check if user is verified
        if (!user.is_verified) {
          throw new Error('Please verify your email address')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          image: user.avatar_url,
        }
      },
    }),

    // Google OAuth Provider (optional - only if credentials are provided)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // GitHub OAuth Provider (optional - only if credentials are provided)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (!existingUser) {
          // Create new user in Supabase
          const { error } = await supabase
            .from('users')
            .insert({
              email: user.email!,
              full_name: user.name || '',
              avatar_url: user.image || null,
              is_verified: true, // OAuth users are pre-verified
              tier: 'free',
            })

          if (error) {
            console.error('Error creating user:', error)
            return false
          }
        } else {
          // Update user info if needed
          await supabase
            .from('users')
            .update({
              avatar_url: user.image || existingUser.avatar_url,
              full_name: user.name || existingUser.full_name,
            })
            .eq('email', user.email)
        }
      }

      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }

      // Fetch user tier from Supabase
      if (token.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('tier, conversions_used')
          .eq('email', token.email)
          .single()

        if (userData) {
          token.tier = userData.tier
          token.conversionsUsed = userData.conversions_used
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tier = token.tier as string
        session.user.conversionsUsed = token.conversionsUsed as number
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
    verifyRequest: '/auth/verify-email',
  },

  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes
  },

  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

