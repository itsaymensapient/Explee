export type ApiErrorBody = {
  error?: string;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, (data as ApiErrorBody) ?? {});
  }

  return data as T;
}

export type HealthProbe = {
  ok: boolean;
  service?: string;
  keyConfigured: boolean;
  baseUrl?: string;
};

export type ExpleeStatus = {
  ok: boolean;
  keyConfigured: boolean;
  me: unknown;
  balance: Record<string, unknown> | null;
  balanceError?: ApiErrorBody | null;
};

export function extractTaskId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  for (const key of ["task_id", "taskId", "id"]) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number") return String(value);
  }
  if (record.task && typeof record.task === "object") {
    const nested = record.task as Record<string, unknown>;
    if (typeof nested.id === "string") return nested.id;
  }
  return null;
}

export function isTerminalTask(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  const status = String(record.status ?? record.state ?? "").toLowerCase();
  if (
    [
      "completed",
      "complete",
      "done",
      "succeeded",
      "success",
      "failed",
      "error",
      "cancelled",
      "canceled",
    ].includes(status)
  ) {
    return true;
  }
  if (Array.isArray(record.results) || Array.isArray(record.contacts)) {
    return (
      status !== "running" &&
      status !== "pending" &&
      status !== "processing" &&
      status !== "queued"
    );
  }
  return false;
}

export function toastMessageForError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code) return `${err.code}: ${err.message}`;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Request failed";
}
