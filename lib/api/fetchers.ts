import { handleApiError } from "@/lib/utils/error";

async function fetcher<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { method: "GET", ...options, headers });

  if (!res.ok) {
    const errorText = await res.text();

    // Handle 404 errors more gracefully - don't log these as they're often expected
    if (res.status === 404) {
      const error = new Error("Resource not found");
      error.name = "NotFoundError";
      throw error;
    }

    handleApiError(errorText, url);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await res.json()) as T;
  }

  // fallback for non-JSON responses
  return res.text() as unknown as T;
}

export function get<T = unknown>(url: string): Promise<T> {
  return fetcher<T>(url);
}

export function post<T = unknown>(url: string, body?: unknown): Promise<T> {
  return fetcher<T>(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T = unknown>(url: string): Promise<T> {
  return fetcher<T>(url, {
    method: "DELETE",
  });
}
