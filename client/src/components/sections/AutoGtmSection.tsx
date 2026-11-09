import { useState } from "react";
import { AdvancedFields } from "@/components/AdvancedFields";
import { Field } from "@/components/Field";
import { ResultPanel } from "@/components/ResultPanel";
import { RunButton } from "@/components/RunButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";
import { splitLines } from "@/lib/utils";

type AutoAction =
  | "list-projects"
  | "create-project"
  | "get-project"
  | "list-campaigns"
  | "create-campaign"
  | "start-campaign"
  | "stop-campaign"
  | "hot-leads"
  | "project-inbox"
  | "balance"
  | "me";

export function AutoGtmSection() {
  const { inputs } = useSharedInputs();
  const action = useApiAction();
  const [kind, setKind] = useState<AutoAction>("list-projects");
  const [domain, setDomain] = useState("");
  const [senderName, setSenderName] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [campaignName, setCampaignName] = useState("Outbound pilot");
  const [offer, setOffer] = useState("");
  const [customerProblem, setCustomerProblem] = useState("");
  const [targetRole, setTargetRole] = useState("");

  async function run() {
    const projectId = inputs.projectId.trim();

    switch (kind) {
      case "list-projects":
        await action.run("/api/explee/autogtm/projects");
        break;
      case "create-project":
        await action.run("/api/explee/autogtm/projects", {
          method: "POST",
          body: JSON.stringify({
            domain: domain.trim() || splitLines(inputs.domains)[0] || null,
            sender_name: senderName.trim() || null,
          }),
        });
        break;
      case "get-project":
        await action.run(`/api/explee/autogtm/projects/${projectId}`);
        break;
      case "list-campaigns":
        await action.run(
          `/api/explee/autogtm/campaigns${projectId ? `?project_id=${encodeURIComponent(projectId)}` : ""}`,
        );
        break;
      case "create-campaign":
        await action.run("/api/explee/autogtm/campaigns", {
          method: "POST",
          body: JSON.stringify({
            project_id: Number(projectId),
            name: campaignName,
            offer: offer || null,
            customer_problem: customerProblem || null,
            target_role:
              targetRole || splitLines(inputs.jobTitles).join(", ") || null,
            target_geography: splitLines(inputs.geography).join(", ") || null,
          }),
        });
        break;
      case "start-campaign":
        await action.run(
          `/api/explee/autogtm/campaigns/${encodeURIComponent(campaignId)}/start`,
          { method: "POST" },
        );
        break;
      case "stop-campaign":
        await action.run(
          `/api/explee/autogtm/campaigns/${encodeURIComponent(campaignId)}/stop`,
          { method: "POST" },
        );
        break;
      case "hot-leads":
        await action.run(
          `/api/explee/autogtm/hot-leads?${new URLSearchParams({
            ...(projectId ? { project_id: projectId } : {}),
            ...(campaignId ? { campaign_id: campaignId } : {}),
          }).toString()}`,
        );
        break;
      case "project-inbox":
        await action.run(
          `/api/explee/autogtm/projects/${encodeURIComponent(projectId)}/inbox`,
        );
        break;
      case "balance":
        await action.run("/api/explee/billing/balance");
        break;
      case "me":
        await action.run("/api/explee/me");
        break;
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Core AutoGTM: projects, campaigns (create/start/stop), hot leads,
        project inbox (read), billing balance, and /me health.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["list-projects", "List projects"],
            ["create-project", "Create project"],
            ["get-project", "Get project"],
            ["list-campaigns", "List campaigns"],
            ["create-campaign", "Create campaign"],
            ["start-campaign", "Start campaign"],
            ["stop-campaign", "Stop campaign"],
            ["hot-leads", "Hot leads"],
            ["project-inbox", "Project inbox"],
            ["balance", "Balance"],
            ["me", "Me"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
              kind === value
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {kind === "create-project" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Domain" hint="defaults to first shared domain">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={splitLines(inputs.domains)[0] || "yourproduct.com"}
            />
          </Field>
          <Field label="Sender name" hint="optional">
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </Field>
        </div>
      )}

      {(kind === "get-project" ||
        kind === "list-campaigns" ||
        kind === "create-campaign" ||
        kind === "hot-leads" ||
        kind === "project-inbox") && (
        <p className="text-xs text-muted-foreground">
          Uses shared project id{!inputs.projectId.trim() ? " (set one above)" : ` (${inputs.projectId})`}.
        </p>
      )}

      {kind === "create-campaign" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Campaign name">
            <Input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </Field>
          <Field label="Target role" hint="defaults to shared titles">
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </Field>
        </div>
      )}

      {(kind === "start-campaign" ||
        kind === "stop-campaign" ||
        kind === "hot-leads") && (
        <Field label="Campaign id" hint={kind === "hot-leads" ? "optional filter" : "required"}>
          <Input
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            placeholder="456"
          />
        </Field>
      )}

      <AdvancedFields>
        {kind === "create-campaign" && (
          <>
            <Field label="Offer">
              <Textarea value={offer} onChange={(e) => setOffer(e.target.value)} />
            </Field>
            <Field label="Customer problem">
              <Textarea
                value={customerProblem}
                onChange={(e) => setCustomerProblem(e.target.value)}
              />
            </Field>
          </>
        )}
        {kind !== "create-campaign" && (
          <p className="text-xs text-muted-foreground">
            More AutoGTM fields can expand here later (budget, schedule, my-copy).
          </p>
        )}
      </AdvancedFields>

      <RunButton
        loading={action.state.loading}
        polling={action.state.polling}
        onClick={() => void run()}
      />
      <ResultPanel state={action.state} />
    </div>
  );
}
