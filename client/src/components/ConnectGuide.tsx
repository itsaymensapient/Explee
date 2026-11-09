import { Badge } from "@/components/ui/badge";

const MCP_CLAUDE = "https://api.explee.com/public/api/mcp";
const MCP_CHATGPT = "https://api.explee.com/public/api/mcp/chatgpt";
const REST_BASE = "https://api.explee.com/public/api/v1";
const DOCS = "https://api.explee.com/public/api/docs";
const OPENAPI = "https://api.explee.com/public/api/openapi.json";

export function ConnectGuide() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
            Connect
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-foreground">
            MCP + REST
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">OAuth for search</Badge>
          <Badge variant="outline">API key for enrich / AutoGTM</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Explee MCP</h3>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>
              Add a custom MCP connector in Claude or ChatGPT using the URL for
              your client.
            </li>
            <li>
              Complete OAuth for search and analysis tools.
            </li>
            <li>
              For contact enrichment and campaign tools, create an Owner/Admin
              API key named <code className="font-mono text-primary/90">Claude/ChatGPT connector</code>.
            </li>
          </ol>
          <div className="space-y-2 font-mono text-[12px] text-foreground/85">
            <p>
              <span className="text-muted-foreground">Claude · </span>
              {MCP_CLAUDE}
            </p>
            <p>
              <span className="text-muted-foreground">ChatGPT · </span>
              {MCP_CHATGPT}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">REST via this console</h3>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>
              Copy <code className="font-mono text-foreground/80">.env.example</code> to{" "}
              <code className="font-mono text-foreground/80">.env</code>.
            </li>
            <li>
              Set <code className="font-mono text-primary/90">EXPLEE_API_KEY</code> on the
              server only. The browser never sees it.
            </li>
            <li>
              Optional: override{" "}
              <code className="font-mono text-foreground/80">EXPLEE_BASE_URL</code>{" "}
              (default {REST_BASE}).
            </li>
            <li>
              Run <code className="font-mono text-foreground/80">npm run dev</code> and
              use the panels below; calls go through{" "}
              <code className="font-mono text-foreground/80">/api/explee/*</code>.
            </li>
          </ol>
          <p className="text-sm text-muted-foreground">
            Docs:{" "}
            <a className="text-primary underline-offset-2 hover:underline" href={DOCS} target="_blank" rel="noreferrer">
              API docs
            </a>
            {" · "}
            <a className="text-primary underline-offset-2 hover:underline" href={OPENAPI} target="_blank" rel="noreferrer">
              OpenAPI
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
