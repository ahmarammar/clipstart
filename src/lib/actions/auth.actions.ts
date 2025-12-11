"use server";

import { signIn, signOut, auth, type AuthSession } from "@/lib/auth";
import { AuthError } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthActionResult = {
  success: boolean;
  error?: string;
  requiresOnboarding?: boolean;
  redirectTo?: string;
};

type LoginApiResponse = {
  status: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      role: "clipper" | "business" | null;
    };
    access_token: string;
  };
};

export async function loginAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  try {
    // First, call the backend API directly to validate credentials and get user data
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginApiResponse = await response.json();

    if (!response.ok || !data.status || !data.data) {
      return {
        success: false,
        error: data.message || "Invalid email or password",
      };
    }

    // Store the user role before creating session
    const userRole = data.data.user.role;

    // Now create the NextAuth session
    // Note: signIn will call the API again through authorize callback,
    // but this ensures we have the user data for routing
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (signInError) {
      // NextAuth v5 may throw redirect errors even with redirect: false
      // If we already validated with the API, we can safely ignore these
      if (signInError instanceof AuthError) {
        if (signInError.type === "CredentialsSignin") {
          return { success: false, error: "Invalid email or password" };
        }
      }
      // For other errors (like redirect errors), continue since API auth succeeded
    }

    // Determine redirect based on role from API response
    if (userRole === null) {
      return {
        success: true,
        requiresOnboarding: true,
        redirectTo: "/onboarding",
      };
    }

    const redirectTo = userRole === "clipper" ? "/clipper" : "/business";
    return { success: true, redirectTo };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signupAction(
  name: string,
  email: string,
  password: string
): Promise<AuthActionResult> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Registration failed. Please try again.",
      };
    }

    // Auto-login after successful registration
    const loginResult = await loginAction(email, password);
    return loginResult;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function assignRoleAction(
  role: "clipper" | "business"
): Promise<AuthActionResult> {
  try {
    const session = (await auth()) as AuthSession | null;

    if (!session?.accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/auth/assign-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Failed to assign role. Please try again.",
      };
    }

    // Redirect to appropriate dashboard
    const redirectTo =
      role === "clipper" ? "/clipper" : "/business";

    return { success: true, redirectTo };
  } catch (error) {
    console.error("Assign role error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function logoutAction() {
  try {
    // Get the session to retrieve the access token
    const session = (await auth()) as AuthSession | null;

    // Call backend logout API to invalidate the token on server
    if (session?.accessToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    }
  } catch (error) {
    // Log error but continue with local signout
    console.error("Backend logout error:", error);
  }

  // Sign out of NextAuth (clears local session)
  await signOut({ redirectTo: "/login" });
}

export async function getSession() {
  return await auth();
}
