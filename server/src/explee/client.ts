import { config, isKeyConfigured } from "../config.js";
import { mapExpleeError, missingKeyError, type MappedError } from "./errors.js";

export type ExpleeResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; mapped: MappedError };

function sanitizeUpstreamBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  const clone = JSON.parse(JSON.stringify(body)) as Record<string, unknown>;
  const sensitive = ["api_key", "apiKey", "x-api-key", "X-API-Key", "token", "secret"];
  for (const key of Object.keys(clone)) {
    if (sensitive.includes(key) || /api[_-]?key/i.test(key)) {
      clone[key] = "[redacted]";
    }
  }
  return clone;
}

export async function expleeFetch(
  method: string,
  path: string,
  options: {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined | null>;
    headers?: Record<string, string>;
  } = {},
): Promise<ExpleeResult> {
  if (!isKeyConfigured()) {
    return { ok: false, mapped: missingKeyError() };
  }

  const url = new URL(
    `${config.expleeBaseUrl}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "X-API-Key": config.expleeApiKey,
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    return {
      ok: false,
      mapped: {
        status: 502,
        code: "upstream_unreachable",
        error:
          err instanceof Error
            ? `Could not reach Explee: ${err.message}`
            : "Could not reach Explee API.",
      },
    };
  }

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text.slice(0, 2000) };
    }
  }

  const safe = sanitizeUpstreamBody(parsed);

  if (!response.ok) {
    return {
      ok: false,
      mapped: mapExpleeError(response.status, safe),
    };
  }

  return { ok: true, status: response.status, data: safe };
}
