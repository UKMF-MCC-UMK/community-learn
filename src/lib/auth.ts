import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const user = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // TODO: Add proper password verification with bcrypt
        // For now, comparing plain text passwords (NOT RECOMMENDED for production)
        if (user.password !== credentials.password) {
          throw new Error("Invalid password");
        }

        return {
          id: String(user.id),
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username =
          (user as unknown as { username?: string }).username ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...(session.user || {}),
          id: token.id as string,
          username: token.username as string,
        } as typeof session.user & { id: string; username: string };
      }
      return session;
    },
  },
};
