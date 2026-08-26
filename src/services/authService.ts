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
  pin: string;
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
    return apiFetch<UserSession>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      fallbackSession
    );
  }

  /**
   * Fetch current authenticated session
   */
  static async getCurrentUser(): Promise<UserSession> {
    return apiFetch<UserSession>(
      "/auth/me",
      { method: "GET" },
      fallbackSession
    );
  }

  /**
   * Log out current user
   */
  static async logout(): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(
      "/auth/logout",
      { method: "POST" },
      { success: true }
    );
  }
}
