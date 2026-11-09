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

type EnrichKind = "email" | "phone" | "email-batch";

export function EnrichSection() {
  const { inputs } = useSharedInputs();
  const action = useApiAction();
  const [kind, setKind] = useState<EnrichKind>("email");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [domain, setDomain] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [preset, setPreset] = useState("basic");
  const [batchJson, setBatchJson] = useState(
    '[\n  {"first_name":"Ma","last_name":"Lin","company_domain":"x.ai"}\n]',
  );

  async function run() {
    const companyDomain =
      domain.trim() || splitLines(inputs.domains)[0] || "";

    if (kind === "email") {
      await action.run("/api/explee/enrich/email", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          company_domain: companyDomain,
          preset,
        }),
      });
      return;
    }

    if (kind === "phone") {
      await action.run("/api/explee/enrich/phone", {
        method: "POST",
        body: JSON.stringify({
          linkedin_url: linkedinUrl,
          ...(emailHint.trim() ? { email: emailHint.trim() } : {}),
          preset,
        }),
      });
      return;
    }

    let contacts: unknown;
    try {
      contacts = JSON.parse(batchJson);
    } catch {
      contacts = [];
    }

    await action.run(
      "/api/explee/enrich/email/batch",
      {
        method: "POST",
        body: JSON.stringify({ contacts, preset }),
      },
      {
        pollPath: (taskId) => `/api/explee/enrich/email/batch/${taskId}`,
      },
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enrich a single contact email or phone, or submit a batch email job and
        poll until complete.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["email", "Email"],
            ["phone", "Phone"],
            ["email-batch", "Email batch"],
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

      {kind === "email" && (
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="First name">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field label="Last name">
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
          <Field label="Company domain" hint="defaults to first shared domain">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={splitLines(inputs.domains)[0] || "acme.com"}
            />
          </Field>
        </div>
      )}

      {kind === "phone" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="LinkedIn URL">
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/…"
            />
          </Field>
          <Field label="Email hint" hint="optional">
            <Input value={emailHint} onChange={(e) => setEmailHint(e.target.value)} />
          </Field>
        </div>
      )}

      {kind === "email-batch" && (
        <Field label="Contacts JSON array">
          <Textarea
            className="min-h-[140px] font-mono text-xs"
            value={batchJson}
            onChange={(e) => setBatchJson(e.target.value)}
          />
        </Field>
      )}

      <AdvancedFields>
        <Field label="Preset">
          <Input value={preset} onChange={(e) => setPreset(e.target.value)} />
        </Field>
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
