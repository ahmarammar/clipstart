import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import type { NextAuthConfig } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extended user type for our backend response
interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: "clipper" | "business" | null;
  backendAccessToken: string;
}

// Helper function to call backend for social login
async function authenticateWithBackend(
  provider: "google" | "facebook",
  token: string
): Promise<{ success: boolean; data?: { user: { id: number; name: string; email: string; role: string | null }; access_token: string } }> {
  const endpoint = provider === "google"
    ? `${API_URL}/auth/google/callback`
    : `${API_URL}/auth/facebook/callback`;

  const payload = provider === "google"
    ? { id_token: token }
    : { access_token: token };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error(`${provider} backend auth failed:`, data);
      return { success: false };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error(`${provider} backend auth error:`, error);
    return { success: false };
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    // Email/Password credentials provider
    Credentials({
      id: "credentials",
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
            backendAccessToken: data.data.access_token,
          } as BackendUser;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

    // Google OAuth provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Facebook OAuth provider
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Handle credentials login - user object has our custom properties
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.role = (user as BackendUser).role;
        token.accessToken = (user as BackendUser).backendAccessToken;
        return token;
      }

      // Handle Google OAuth - call backend to get our access token
      if (account?.provider === "google" && account.id_token) {
        const result = await authenticateWithBackend("google", account.id_token);

        if (result.success && result.data) {
          token.id = String(result.data.user.id);
          token.role = result.data.user.role;
          token.accessToken = result.data.access_token;
        }
        return token;
      }

      // Handle Facebook OAuth - call backend to get our access token
      if (account?.provider === "facebook" && account.access_token) {
        const result = await authenticateWithBackend("facebook", account.access_token);

        if (result.success && result.data) {
          token.id = String(result.data.user.id);
          token.role = result.data.user.role;
          token.accessToken = result.data.access_token;
        }
        return token;
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

    async redirect({ url, baseUrl }) {
      // Handle redirect after OAuth sign in
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 60, // 60 hours
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
