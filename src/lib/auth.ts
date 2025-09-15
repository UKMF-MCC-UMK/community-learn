import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User, Session } from "next-auth";
import axios from "axios";

// Deklarasi modul untuk menambahkan properti custom ke Session dan User
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      accessToken?: string; // Token untuk otentikasi API
      department?: string;
      position?: string;
      role?: string;
    };
  }

  // Objek User yang dikembalikan dari fungsi `authorize`
  interface User {
    token: string;
    id: string;
    username: string;
    name?: string;
    department?: string;
    position?: string;
    role?: string;
  }
}

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
          throw new Error("Username atau password tidak boleh kosong");
        }

        try {
       
          const loginRes = await axios.post(
            `${process.env.BACKEND_API}/api/login`,
            {
              nim: credentials.username,
              password: credentials.password,
            }
          );
          
          const accessToken = loginRes.data.data.access_token;
          if (!accessToken) {
            throw new Error("Token tidak ditemukan setelah login");
          }

          const userRes = await axios.get(
            `${process.env.BACKEND_API}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
            
          const userData = userRes.data.data;
          if (!userData) {
            throw new Error("Gagal mendapatkan data pengguna");
          }
            
          return {
            id: userData.id,
            username: credentials.username,
            token: accessToken, 
            name: userData.name,
            department: userData.department,
            position: userData.position,
            role: userData.role.name,
          };

        } catch (error) {
          console.error("Authorization Error:", error);
          return null; 
        }
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
        token.username = user.username;
        token.name = user.name;
        token.accessToken = user.token; 
        token.department = user.department;
        token.position = user.position;
        token.role = user.role;
      }
      
      return token;
    },

    async session({ session, token }) {
    
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
        session.user.accessToken = token.accessToken as string;
        session.user.department = token.department as string;
        session.user.position = token.position as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};