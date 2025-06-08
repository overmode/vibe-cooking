import { handleApiError } from "@/lib/utils/error";

export async function fetcher<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    
    // Handle 404 errors more gracefully - don't log these as they're often expected
    if (res.status === 404) {
      const error = new Error('Resource not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    handleApiError(errorText, url);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  // fallback for non-JSON responses
  return res.text() as unknown as T;
}

export function get<T = unknown>(url: string): Promise<T> {
  return fetcher<T>(url);
}

export function post<T = unknown, Body = unknown>(
  url: string,
  body?: Body
): Promise<T> {
  return fetcher<T>(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function put<T = unknown, Body = unknown>(
  url: string,
  body?: Body
): Promise<T> {
  return fetcher<T>(url, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T = unknown>(url: string): Promise<T> {
  return fetcher<T>(url, {
    method: "DELETE",
  });
}
