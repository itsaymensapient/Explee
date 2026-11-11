import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Explee control center"
        description="Operate search, enrich, find & enrich, and AutoGTM through the Express proxy. Shared context below feeds every panel."
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

      <section className="space-y-3">
        <h2 className="font-display text-xl font-medium tracking-tight">
          Capabilities
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {navItems
            .filter((item) => item.to !== "/")
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group rounded-xl border border-border/70 bg-card/30 p-4 transition hover:border-primary/35 hover:bg-card/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-primary" />
                      <p className="font-medium">{item.label}</p>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <EndpointCard
          title="Billing balance"
          method="GET"
          path="/api/explee/billing/balance"
          description="Quick health probe for credit balance when a key is configured."
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
          description="Confirm the server key resolves to an Explee owner."
          state={meAction.state}
          onRun={() =>
            void meAction.run("/api/explee/me", undefined, {
              successToast: "Identity loaded",
            })
          }
        />
      </section>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          Domains {domainList.length || "none"}
        </Badge>
        <Badge variant="secondary">Titles {titleList.length || "none"}</Badge>
        <Badge variant="secondary">
          Project {inputs.projectId || "unset"}
        </Badge>
        <Button asChild variant="outline" size="sm">
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
    <div className="rounded-xl border border-border/70 bg-card/30 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-medium tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
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
