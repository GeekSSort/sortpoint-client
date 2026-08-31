import { apiFetch } from "./apiClient";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  pin?: string;
  password?: string;
}

const fallbackSession: UserSession = {
  id: "user-1",
  name: "Zayn Malik",
  email: "zaynmalik29@gmail.com",
  avatar: "/image.png",
  role: "Store Manager",
};

export class AuthService {
  /**
   * Log in user with credentials
   */
  static async login(payload: LoginPayload): Promise<UserSession> {
    const password = payload.password || payload.pin || "";
    const res = await apiFetch<{
      success?: boolean;
      data?: { access?: string; refresh?: string };
      access?: string;
      refresh?: string;
    }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: password,
        }),
      },
      fallbackSession as any
    );

    const accessToken = res?.data?.access || res?.access;
    const refreshToken = res?.data?.refresh || res?.refresh;

    if (accessToken && typeof window !== "undefined") {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      return await AuthService.getCurrentUser();
    }

    return (res as unknown as UserSession) || fallbackSession;
  }

  /**
   * Fetch current authenticated session
   */
  static async getCurrentUser(): Promise<UserSession> {
    const res = await apiFetch<{
      success?: boolean;
      data?: {
        id: string;
        email: string;
        fullName?: string;
        full_name?: string;
        roles?: string[];
      };
      id?: string;
      email?: string;
      fullName?: string;
      roles?: string[];
    }>(
      "/auth/me",
      { method: "GET" },
      fallbackSession
    );

    const userData = res?.data || res;
    if (userData && (userData.id || userData.email)) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined;
      const role = Array.isArray(userData.roles) && userData.roles.length > 0 ? userData.roles[0] : "Store Manager";
      return {
        id: userData.id || "user-1",
        name: userData.fullName || (userData as any).full_name || userData.email || "User",
        email: userData.email || fallbackSession.email,
        avatar: "/image.png",
        role: role,
        token: token,
      };
    }

    return fallbackSession;
  }

  /**
   * Log out current user
   */
  static async logout(): Promise<{ success: boolean }> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    if (refreshToken) {
      await apiFetch<{ success: boolean }>(
        "/auth/logout",
        {
          method: "POST",
          body: JSON.stringify({ refresh: refreshToken }),
        },
        { success: true }
      );
    }

    return { success: true };
  }
}
