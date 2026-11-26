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

export const apiClient = {
  get: <T>(url: string, params?: Record<string, string>) =>
    request<T>(params ? `${url}?${new URLSearchParams(params)}` : url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  delete: (url: string) => request<void>(url, { method: "DELETE" }),
};
