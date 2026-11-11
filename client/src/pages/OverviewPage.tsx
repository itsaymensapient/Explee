import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { SharedContextPanel } from "@/components/SharedContextPanel";
import { navItems } from "@/components/layout/nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStatus } from "@/context/StatusContext";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";
import { EndpointCard } from "@/components/EndpointCard";

export function OverviewPage() {
  const { health, status, balanceLabel, keyConfiguredLabel } = useOverviewLabels();
  const { inputs, domainList, titleList } = useSharedInputs();
  const balanceAction = useApiAction();
  const meAction = useApiAction();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Overview"
        title="Explee control center"
        description="This console talks to Explee through your Express proxy. Confirm the key is healthy, set shared context once, then open a capability panel to run real REST calls."
      />

      <PageIntro
        summary="Start here before typing into Search or Enrich. The browser never sees EXPLEE_API_KEY — every request goes through /api/* on the local server."
        steps={[
          "Check connection, key, and balance chips below (or open Settings if the key is missing).",
          "Fill Shared context with ICP, titles, domains, and optional project/campaign IDs.",
          "Open a capability card and read its “Before you run” notes before submitting inputs.",
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Connection"
          value={health?.ok ? "Healthy" : "Unavailable"}
          hint={health?.baseUrl ?? "Express /api"}
        />
        <StatCard
          label="API key"
          value={keyConfiguredLabel}
          hint="Never exposed to the browser"
        />
        <StatCard
          label="Balance"
          value={balanceLabel ?? "—"}
          hint={status?.keyConfigured ? "From /billing/balance" : "Set EXPLEE_API_KEY"}
        />
      </div>

      <SharedContextPanel />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Capabilities
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Each route is a focused operator panel. Shared context carries forward so you are not re-entering the same ICP on every screen.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {navItems
            .filter((item) => item.to !== "/")
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group rounded-lg border border-border/70 bg-card/35 p-5 transition hover:border-gold/35 hover:bg-card/55"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-primary" />
                      <p className="font-medium">{item.label}</p>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-gold" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Quick probes
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            No form required — these confirm the server key can reach billing and identity endpoints.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <EndpointCard
            title="Billing balance"
            method="GET"
            path="/api/explee/billing/balance"
            description="Fetches credit balance through the Express proxy when EXPLEE_API_KEY is configured."
            howto={[
              "Make sure Settings shows the key as configured.",
              "Press Run — no inputs are needed for this probe.",
            ]}
            state={balanceAction.state}
            onRun={() =>
              void balanceAction.run("/api/explee/billing/balance", undefined, {
                successToast: "Balance loaded",
              })
            }
          />
          <EndpointCard
            title="API key owner"
            method="GET"
            path="/api/explee/me"
            description="Confirms the server-side key resolves to an Explee owner account."
            howto={[
              "Use this after rotating keys to verify the new credential.",
              "Press Run to load the owner payload in the result panel.",
            ]}
            state={meAction.state}
            onRun={() =>
              void meAction.run("/api/explee/me", undefined, {
                successToast: "Identity loaded",
              })
            }
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">
          Domains {domainList.length || "none"}
        </Badge>
        <Badge variant="secondary">Titles {titleList.length || "none"}</Badge>
        <Badge variant="secondary">
          Project {inputs.projectId || "unset"}
        </Badge>
        <Button asChild variant="outline" size="default">
          <Link to="/settings">Open connect guide</Link>
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/40 p-5">
      <p className="text-xs font-medium tracking-wide text-gold">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function useOverviewLabels() {
  const { health, status, balanceLabel } = useStatus();
  const keyConfigured = Boolean(
    status?.keyConfigured ?? health?.keyConfigured,
  );
  return {
    health,
    status,
    balanceLabel,
    keyConfiguredLabel: keyConfigured ? "Configured" : "Not configured",
  };
}
