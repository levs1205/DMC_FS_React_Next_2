export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(body?.error?.message ?? "Ocurrió un error inesperado", response.status);
  }

  return body as T;
}

type QueryParams = Record<string, string | number>;

function withQuery(url: string, params?: QueryParams): string {
  if (!params) return url;
  const entries = Object.entries(params).map(([key, value]) => [key, String(value)]);
  return `${url}?${new URLSearchParams(entries)}`;
}

export const apiClient = {
  get: <T>(url: string, params?: QueryParams) => request<T>(withQuery(url, params)),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
