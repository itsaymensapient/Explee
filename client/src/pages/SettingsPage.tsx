import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStatus } from "@/context/StatusContext";

const MCP_CLAUDE = "https://api.explee.com/public/api/mcp";
const MCP_CHATGPT = "https://api.explee.com/public/api/mcp/chatgpt";
const REST_BASE = "https://api.explee.com/public/api/v1";
const DOCS = "https://api.explee.com/public/api/docs";
const OPENAPI = "https://api.explee.com/public/api/openapi.json";

export function SettingsPage() {
  const { health, status, balanceLabel, refresh } = useStatus();
  const keyConfigured = Boolean(
    status?.keyConfigured ?? health?.keyConfigured,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Connect Explee"
        description="Wire MCP connectors and the REST key used by this Express proxy. The browser never receives EXPLEE_API_KEY."
        actions={
          <Button variant="outline" onClick={() => void refresh()}>
            Refresh status
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <InfoTile
          label="Key"
          value={keyConfigured ? "Configured" : "Missing"}
          tone={keyConfigured ? "ok" : "warn"}
        />
        <InfoTile
          label="Base URL"
          value={health?.baseUrl ?? REST_BASE}
          tone="neutral"
        />
        <InfoTile
          label="Balance"
          value={balanceLabel ?? "—"}
          tone="neutral"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-medium">MCP</h2>
            <Badge variant="outline">OAuth for search</Badge>
            <Badge variant="outline">Named key for enrich</Badge>
          </div>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>Add a custom MCP connector in Claude or ChatGPT.</li>
            <li>Complete OAuth for search and analysis tools.</li>
            <li>
              For contact + campaign tools, create an Owner/Admin API key named{" "}
              <code className="font-mono text-primary/90">
                Claude/ChatGPT connector
              </code>
              .
            </li>
          </ol>
          <CopyRow label="Claude MCP" value={MCP_CLAUDE} />
          <CopyRow label="ChatGPT MCP" value={MCP_CHATGPT} />
        </div>

        <div className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-medium">REST console</h2>
            <Badge variant="outline">X-API-Key on server</Badge>
          </div>
          <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
            <li>
              Copy <code className="font-mono">.env.example</code> →{" "}
              <code className="font-mono">.env</code>.
            </li>
            <li>
              Set <code className="font-mono text-primary/90">EXPLEE_API_KEY</code>{" "}
              on the Express process only.
            </li>
            <li>
              Optional{" "}
              <code className="font-mono">EXPLEE_BASE_URL</code> (default{" "}
              {REST_BASE}).
            </li>
            <li>
              Run <code className="font-mono">npm run dev</code>. UI calls{" "}
              <code className="font-mono">/api/explee/*</code> only.
            </li>
          </ol>
          <CopyRow label="REST base" value={REST_BASE} />
          <p className="text-sm text-muted-foreground">
            Docs:{" "}
            <a
              className="text-primary underline-offset-2 hover:underline"
              href={DOCS}
              target="_blank"
              rel="noreferrer"
            >
              API docs
            </a>
            {" · "}
            <a
              className="text-primary underline-offset-2 hover:underline"
              href={OPENAPI}
              target="_blank"
              rel="noreferrer"
            >
              OpenAPI
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/30 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-2 break-all font-display text-xl font-medium tracking-tight ${
          tone === "ok"
            ? "text-primary"
            : tone === "warn"
              ? "text-amber-200"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-all font-mono text-[12px] text-foreground/90">
          {value}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => void copy()} aria-label={`Copy ${label}`}>
        {copied ? (
          <Check className="size-4 text-primary" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
}
