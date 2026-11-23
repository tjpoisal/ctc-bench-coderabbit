export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  retries?: number;
}

/** The one HTTP client for this app. Retries 5xx responses with a fixed delay. */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const retries = options.retries ?? 2;
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: { "content-type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    if (response.ok) {
      return (await response.json()) as T;
    }
    if (response.status < 500 || attempt >= retries) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}
