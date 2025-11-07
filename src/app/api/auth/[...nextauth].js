import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../src/lib/prisma';

/**
 * Configuração do NextAuth
 * SEGURANÇA: Nunca logue NEXTAUTH_SECRET ou tokens em produção
 */
export const authOptions = {
  // Adapter para persistir usuários/sessões no banco
  adapter: PrismaAdapter(prisma),
  
  // Providers de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Escopos adicionais podem ser configurados aqui
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // Estratégia de sessão (database ou jwt)
  // Usando 'jwt' para melhor performance, mas 'database' também é válido
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  // Páginas customizadas (opcional)
  pages: {
    signIn: '/auth/signin', // Pode criar página customizada
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },

  // Callbacks para customizar tokens e sessões
  callbacks: {
    /**
     * Callback JWT: adiciona userId ao token
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },

    /**
     * Callback Session: adiciona userId à sessão do cliente
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },

  // Secret para assinar tokens (OBRIGATÓRIO em produção)
  secret: process.env.NEXTAUTH_SECRET,

  // Habilitar debug em desenvolvimento
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
