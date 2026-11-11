import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { CopyRow } from "@/components/CopyRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EndpointCard } from "@/components/EndpointCard";
import { useApiAction } from "@/hooks/useApiAction";

const MCP_GENERAL = "https://api.explee.com/public/api/mcp";
const MCP_CHATGPT = "https://api.explee.com/public/api/mcp/chatgpt";
const OPENAPI = "https://api.explee.com/public/api/openapi.json";
const CHATGPT_GUIDE = "https://explee.com/integrations/chatgpt";
const MCP_GUIDE = "https://explee.com/integrations/mcp";

const CURSOR_MCP_SNIPPET = `{
  "mcpServers": {
    "explee": {
      "url": "https://api.explee.com/public/api/mcp"
    }
  }
}`;

const OPENAI_AGENT_SNIPPET = `// OpenAI Agents / tool-calling: hand Explee's OpenAPI to the agent runtime.
// Keep EXPLEE_API_KEY on your server — never in the browser or client bundle.

const OPENAPI_URL = "https://api.explee.com/public/api/openapi.json";
const EXPLEE_BASE = "https://api.explee.com/public/api/v1";

export async function loadExpleeTools() {
  const res = await fetch(OPENAPI_URL);
  if (!res.ok) throw new Error(\`OpenAPI \${res.status}\`);
  const schema = await res.json();
  // Pass \`schema\` into your OpenAI agent / tool registry.
  // Authenticate REST tool calls with header: X-API-Key: process.env.EXPLEE_API_KEY
  return { schema, baseUrl: EXPLEE_BASE };
}

// ChatGPT path (no custom code): add MCP plugin
// URL: https://api.explee.com/public/api/mcp/chatgpt  (OAuth)
`;

type AgentConfig = {
  tip: string;
  openapiUrl: string;
  mcp: { general: string; chatgpt: string };
  guides: Record<string, string>;
  connectorKeyName: string;
};

export function AgentsPage() {
  const configAction = useApiAction();
  const openapiAction = useApiAction();
  const [config, setConfig] = useState<AgentConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const data = await configAction.run<AgentConfig>("/api/agent/config");
      if (!cancelled && data && typeof data === "object" && "openapiUrl" in data) {
        setConfig(data);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Load connector metadata once when the page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="AI Agents"
        title="OpenAI & ChatGPT with Explee"
        description="Explee already ships an OpenAI/ChatGPT MCP connector and a public OpenAPI schema meant for AI agents. Wire the assistant here, then use this console for REST operations."
      />

      <PageIntro
        summary="Two supported paths: (1) ChatGPT / OpenAI MCP — OAuth plugin, no OpenAPI wiring, or (2) custom OpenAI agents — give the runtime Explee's OpenAPI and call REST with X-API-Key on the server."
        steps={[
          "Prefer ChatGPT? Add the ChatGPT MCP URL as a custom plugin and complete OAuth.",
          "Building your own OpenAI agent? Feed it https://api.explee.com/public/api/openapi.json (Explee's documented agent tip).",
          "For enrich / campaign tools in MCP, create an Owner/Admin key named Claude/ChatGPT connector, then keep EXPLEE_API_KEY on Express for this dashboard.",
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold">ChatGPT / OpenAI MCP</h2>
            <Badge variant="default">Provided by Explee</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explee publishes a ChatGPT-specific MCP endpoint. In ChatGPT, add a custom MCP
            server, paste the URL, choose OAuth, then @-mention Explee in a new chat.
          </p>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>
              Open{" "}
              <a
                className="text-primary underline-offset-2 hover:underline"
                href="https://chatgpt.com/plugins"
                target="_blank"
                rel="noreferrer"
              >
                chatgpt.com/plugins
              </a>
              .
            </li>
            <li>Add custom MCP server → name it Explee → paste the ChatGPT MCP URL.</li>
            <li>Authenticate with OAuth when prompted.</li>
            <li>
              For contact lookups / campaigns, create API key{" "}
              <code className="font-mono text-primary/90">Claude/ChatGPT connector</code>.
            </li>
          </ol>
          <CopyRow label="ChatGPT MCP URL" value={config?.mcp.chatgpt ?? MCP_CHATGPT} />
          <CopyRow label="General MCP URL" value={config?.mcp.general ?? MCP_GENERAL} />
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={CHATGPT_GUIDE} target="_blank" rel="noreferrer">
                ChatGPT setup guide
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={MCP_GUIDE} target="_blank" rel="noreferrer">
                MCP overview
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold">OpenAPI for AI agents</h2>
            <Badge variant="outline">OpenAI agent runtimes</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explee&apos;s public docs tip: documentation is for humans — for AI agents, provide
            the OpenAPI schema instead. Point your OpenAI agent / tool registry at this URL and
            authenticate tool calls with <code className="font-mono">X-API-Key</code> from{" "}
            <code className="font-mono">EXPLEE_API_KEY</code> on the server.
          </p>
          <CopyRow label="OpenAPI schema" value={config?.openapiUrl ?? OPENAPI} />
          <CopyRow
            label="Connector key name"
            value={config?.connectorKeyName ?? "Claude/ChatGPT connector"}
          />
          <Button asChild variant="outline">
            <Link to="/settings">REST key lives in Settings</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="font-display text-lg font-semibold">Cursor MCP snippet</h2>
          <p className="text-sm text-muted-foreground">
            Drop into <code className="font-mono">~/.cursor/mcp.json</code>, then authenticate
            under Cursor Settings → MCP.
          </p>
          <pre className="overflow-auto rounded-md border border-border/60 bg-background/50 p-3 font-mono text-[12px] leading-relaxed">
            {CURSOR_MCP_SNIPPET}
          </pre>
          <Button
            variant="outline"
            onClick={() => void navigator.clipboard.writeText(CURSOR_MCP_SNIPPET)}
          >
            Copy snippet
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
          <h2 className="font-display text-lg font-semibold">OpenAI agent starter</h2>
          <p className="text-sm text-muted-foreground">
            Minimal pattern: load Explee OpenAPI, register tools, keep the API key server-side.
          </p>
          <pre className="max-h-72 overflow-auto rounded-md border border-border/60 bg-background/50 p-3 font-mono text-[12px] leading-relaxed">
            {OPENAI_AGENT_SNIPPET}
          </pre>
          <Button
            variant="outline"
            onClick={() => void navigator.clipboard.writeText(OPENAI_AGENT_SNIPPET)}
          >
            Copy snippet
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <EndpointCard
          title="Agent connector config"
          method="GET"
          path="/api/agent/config"
          description="Returns Explee's OpenAI/ChatGPT MCP URLs and OpenAPI tip from this Express console (no secrets)."
          howto={[
            "No inputs required.",
            "Run to refresh connector metadata from the local API.",
          ]}
          state={configAction.state}
          onRun={() =>
            void configAction.run("/api/agent/config", undefined, {
              successToast: "Agent config loaded",
            })
          }
        />
        <EndpointCard
          title="OpenAPI summary"
          method="GET"
          path="/api/agent/openapi-summary"
          description="Fetches Explee's public OpenAPI and returns title, path count, and sample paths — what you hand to an OpenAI agent."
          howto={[
            "Public schema — does not require EXPLEE_API_KEY.",
            "Run to confirm the agent-facing schema is reachable.",
          ]}
          state={openapiAction.state}
          onRun={() =>
            void openapiAction.run("/api/agent/openapi-summary", undefined, {
              successToast: "OpenAPI summary loaded",
            })
          }
        />
      </section>
    </div>
  );
}
