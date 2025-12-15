import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    tier?: string
    conversionsUsed?: number
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      tier?: string
      conversionsUsed?: number
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    tier?: string
    conversionsUsed?: number
  }
}

