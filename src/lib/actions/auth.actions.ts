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
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: number;
      name: string;
      email: string;
      role: "clipper" | "business" | null;
    };
  };
};

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthActionResult> {
  try {
    // First, call the backend API directly to validate credentials and get user data
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
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
        rememberMe: String(rememberMe),
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

export async function forgotPasswordAction(
  email: string
): Promise<AuthActionResult> {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Failed to send reset link. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function verifyResetTokenAction(
  email: string,
  token: string
): Promise<AuthActionResult> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, token }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Invalid or expired reset link.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Verify reset token error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function resetPasswordAction(
  email: string,
  token: string,
  password: string
): Promise<AuthActionResult> {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Failed to reset password. Please try again.",
      };
    }

    return { success: true, redirectTo: "/login" };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export type ProfileUpdateResult = {
  success: boolean;
  error?: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
};

export async function updateProfileAction(
  name: string
): Promise<ProfileUpdateResult> {
  try {
    const session = (await auth()) as AuthSession | null;

    if (!session?.accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(`${API_URL}/profile/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        error: data.message || "Failed to update profile. Please try again.",
      };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
