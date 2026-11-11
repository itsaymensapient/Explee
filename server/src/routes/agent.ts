import { Router } from "express";

export const agentRouter = Router();

export const expleeAgentLinks = {
  mcpGeneral: "https://api.explee.com/public/api/mcp",
  mcpChatgpt: "https://api.explee.com/public/api/mcp/chatgpt",
  openapi: "https://api.explee.com/public/api/openapi.json",
  docs: "https://api.explee.com/public/api/docs",
  chatgptGuide: "https://explee.com/integrations/chatgpt",
  mcpGuide: "https://explee.com/integrations/mcp",
  apiKeys: "https://explee.com/app-auto-gtm/api-keys",
} as const;

/** Public connector metadata for OpenAI / ChatGPT / MCP agents (no secrets). */
agentRouter.get("/config", (_req, res) => {
  res.json({
    provider: "explee",
    tip: "Explee documents are for humans. For AI agents, provide the OpenAPI schema URL.",
    openapiUrl: expleeAgentLinks.openapi,
    mcp: {
      general: expleeAgentLinks.mcpGeneral,
      chatgpt: expleeAgentLinks.mcpChatgpt,
    },
    guides: {
      chatgpt: expleeAgentLinks.chatgptGuide,
      mcp: expleeAgentLinks.mcpGuide,
      docs: expleeAgentLinks.docs,
      apiKeys: expleeAgentLinks.apiKeys,
    },
    connectorKeyName: "Claude/ChatGPT connector",
    auth: {
      mcp: "OAuth (sign in with Explee)",
      rest: "X-API-Key header on server-side calls only",
    },
  });
});

/**
 * Summarize Explee's public OpenAPI for the console.
 * Schema is public; no EXPLEE_API_KEY required.
 */
agentRouter.get("/openapi-summary", async (_req, res) => {
  try {
    const response = await fetch(expleeAgentLinks.openapi, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      res.status(502).json({
        error: `OpenAPI fetch failed (${response.status})`,
        code: "openapi_upstream_error",
      });
      return;
    }
    const schema = (await response.json()) as {
      info?: { title?: string; version?: string; description?: string };
      paths?: Record<string, unknown>;
      components?: unknown;
    };
    const paths = Object.keys(schema.paths ?? {});
    res.json({
      title: schema.info?.title ?? "Explee Public API",
      version: schema.info?.version ?? null,
      openapiUrl: expleeAgentLinks.openapi,
      tip: "To integrate with AI agents, provide them with the OpenAPI schema at https://api.explee.com/public/api/openapi.json",
      pathCount: paths.length,
      samplePaths: paths.slice(0, 24),
    });
  } catch (err) {
    res.status(502).json({
      error:
        err instanceof Error
          ? `Could not load OpenAPI: ${err.message}`
          : "Could not load OpenAPI",
      code: "openapi_unreachable",
    });
  }
});
