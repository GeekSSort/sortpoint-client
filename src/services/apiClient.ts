/**
 * Centralized API Client with environment detection, fallback strategy,
 * and key mapping (e.g., snake_case to camelCase).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Utility function to convert snake_case object keys to camelCase.
 */
export function snakeToCamelCase<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamelCase(v)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
      result[camelKey] = snakeToCamelCase(obj[key]);
      return result;
    }, {} as Record<string, any>) as T;
  }
  return obj;
}

export interface ApiFetchOptions extends RequestInit {
  mapSnakeCase?: boolean;
}

/**
 * Performs a fetch call to NEXT_PUBLIC_API_URL if configured.
 * If URL is undefined or if the network/HTTP request fails, returns fallbackData wrapped in a Promise.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: ApiFetchOptions,
  fallbackData?: T | (() => Promise<T> | T),
  mapper?: (data: any) => T
): Promise<T> {
  const { mapSnakeCase = true, ...fetchOptions } = options || {};

  if (API_BASE_URL) {
    try {
      const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...fetchOptions.headers,
        },
        ...fetchOptions,
      });

      if (response.ok) {
        let json = await response.json();
        if (mapSnakeCase) {
          json = snakeToCamelCase(json);
        }
        if (mapper) {
          return mapper(json);
        }
        return json as T;
      }
      console.warn(`[API Fetch Warning] ${endpoint} returned status ${response.status}. Using fallback.`);
    } catch (error) {
      console.warn(`[API Fetch Error] Request to ${endpoint} failed. Using fallback.`, error);
    }
  }

  // Graceful Fallback Strategy
  if (typeof fallbackData === "function") {
    return (fallbackData as () => Promise<T> | T)();
  }

  if (fallbackData !== undefined) {
    return fallbackData;
  }

  return null as unknown as T;
}
