const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api/v1';

/**
 * Base fetch wrapper with error handling
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, options);

  if (!res.ok) {
    // Normalize error shape for TanStack Query
    const message = await res.text();

    throw new Error(`HTTP ${res.status}: ${message}`);
  }

  return res.json();
}

/**
 * Type for query parameter values
 */
export type QueryParamValue = string | number | boolean | string[] | undefined;

/**
 * Build URL with query parameters
 */
export function buildQueryUrl<T extends Record<string, QueryParamValue>>(
  endpoint: string,
  params?: T,
): string {
  if (!params) {
    return endpoint;
  }

  const url = new URL(endpoint, API_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.append(key, String(value));
    }
  });

  return url.pathname + url.search;
}
