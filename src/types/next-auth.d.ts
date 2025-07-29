/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      createdAt?: string;
      materiCount?: number;
    };
  }

  interface User {
    id: string;
    username: string;
    name?: string | null;
    email?: string | null;
    createdAt?: string;
    materiCount?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
