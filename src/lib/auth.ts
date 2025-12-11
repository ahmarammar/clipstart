import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.status) {
            return null;
          }

          // Return user with custom properties
          return {
            id: String(data.data.user.id),
            name: data.data.user.name,
            email: data.data.user.email,
            role: data.data.user.role,
            accessToken: data.data.access_token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - pass custom properties to token
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string | null }).role;
        token.accessToken = (user as { accessToken: string }).accessToken;
      }

      // Handle session update (e.g., after role assignment)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Pass custom token properties to session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "clipper" | "business" | null,
        },
        accessToken: token.accessToken as string,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 60, // 60 hours (matching API's expires_in: 216000 seconds)
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export type for session user with our custom properties
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "clipper" | "business" | null;
};

export type AuthSession = {
  user: SessionUser;
  accessToken: string;
  expires: string;
};
