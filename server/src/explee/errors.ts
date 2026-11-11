import type { Response } from "express";

export type MappedError = {
  status: number;
  error: string;
  code: string;
  details?: unknown;
};

const STATUS_MAP: Record<number, { code: string; error: string }> = {
  401: {
    code: "unauthorized",
    error: "Invalid or missing API key. Set EXPLEE_API_KEY in the server environment.",
  },
  402: {
    code: "payment_required",
    error: "Insufficient credit balance or billing requirement. Top up in the Explee app.",
  },
  422: {
    code: "validation_error",
    error: "Validation error. Check request body and parameters.",
  },
  429: {
    code: "rate_limited",
    error: "Rate limited by Explee. Wait and retry.",
  },
};

export function mapExpleeError(
  status: number,
  body: unknown,
  fallbackMessage?: string,
): MappedError {
  const mapped = STATUS_MAP[status];
  if (mapped) {
    return {
      status,
      code: mapped.code,
      error: extractMessage(body) ?? mapped.error,
      details: body,
    };
  }

  if (status === 404) {
    return {
      status,
      code: "not_found",
      error: extractMessage(body) ?? "Resource not found.",
      details: body,
    };
  }

  return {
    status: status >= 400 ? status : 502,
    code: "upstream_error",
    error:
      extractMessage(body) ??
      fallbackMessage ??
      `Explee request failed with status ${status}.`,
    details: body,
  };
}

function extractMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const record = body as Record<string, unknown>;
  for (const key of ["detail", "message", "error", "title"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  if (Array.isArray(record.detail)) {
    try {
      return JSON.stringify(record.detail);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function sendMappedError(res: Response, mapped: MappedError): void {
  res.status(mapped.status).json({
    error: mapped.error,
    code: mapped.code,
    details: mapped.details,
  });
}

export function missingKeyError(): MappedError {
  return {
    status: 401,
    code: "key_not_configured",
    error:
      "EXPLEE_API_KEY is not configured on the server. Add it to .env and restart.",
  };
}
