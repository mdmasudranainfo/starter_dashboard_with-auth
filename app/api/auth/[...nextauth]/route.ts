import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text', placeholder: '+8801742818037' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch('http://tarashiserver.southasianetwork.org/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              phone: credentials.phone,
              password: credentials.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();

          if (res.ok && data.success) {
            return {
              id: data.data.user.id,
              phone: data.data.user.phone,
              name: data.data.user.name,
              role: data.data.user.role,
              accessToken: data.data.accessToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          phone: token.phone as string,
          name: token.name as string,
          role: token.role as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };