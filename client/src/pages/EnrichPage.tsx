import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SharedContextPanel } from "@/components/SharedContextPanel";
import { EndpointCard } from "@/components/EndpointCard";
import { AdvancedFields } from "@/components/AdvancedFields";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";

export function EnrichPage() {
  const { inputs, firstDomain } = useSharedInputs();
  const email = useApiAction();
  const phone = useApiAction();
  const batch = useApiAction();
  const poll = useApiAction();

  const [firstName, setFirstName] = useState("Ada");
  const [lastName, setLastName] = useState("Lovelace");
  const [domainOverride, setDomainOverride] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState(
    "https://www.linkedin.com/in/satyanadella/",
  );
  const [emailHint, setEmailHint] = useState("");
  const [presetOverride, setPresetOverride] = useState("");
  const [taskId, setTaskId] = useState("");

  const companyDomain = domainOverride.trim() || firstDomain;
  const preset = presetOverride.trim() || inputs.enrichPreset || "basic";

  const batchDefault = useMemo(
    () =>
      JSON.stringify(
        [
          {
            first_name: firstName || "Ma",
            last_name: lastName || "Lin",
            company_domain: companyDomain || "x.ai",
          },
        ],
        null,
        2,
      ),
    [firstName, lastName, companyDomain],
  );
  const [batchJson, setBatchJson] = useState(batchDefault);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Enrich"
        title="Contact enrichment"
        description="Single email/phone lookups and async batch email with automatic polling."
      />

      <SharedContextPanel compact />

      <div className="space-y-4">
        <EndpointCard
          title="Enrich email"
          method="POST"
          path="/api/explee/enrich/email"
          description="Find email by first name, last name, and company domain."
          uses={[`domain: ${companyDomain || "required"}`, `preset: ${preset}`]}
          state={email.state}
          disabled={!firstName || !lastName || !companyDomain}
          onRun={() =>
            void email.run(
              "/api/explee/enrich/email",
              {
                method: "POST",
                body: JSON.stringify({
                  first_name: firstName,
                  last_name: lastName,
                  company_domain: companyDomain,
                  preset,
                }),
              },
              { successToast: "Email enrich complete" },
            )
          }
        >
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="First name">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last name">
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
            <Field label="Company domain" hint="defaults to shared">
              <Input
                value={domainOverride}
                onChange={(e) => setDomainOverride(e.target.value)}
                placeholder={firstDomain || "acme.com"}
              />
            </Field>
          </div>
          <AdvancedFields>
            <Field label="Preset override">
              <Input
                value={presetOverride}
                onChange={(e) => setPresetOverride(e.target.value)}
                placeholder={inputs.enrichPreset}
              />
            </Field>
          </AdvancedFields>
        </EndpointCard>

        <EndpointCard
          title="Enrich phone"
          method="POST"
          path="/api/explee/enrich/phone"
          description="Find phone by LinkedIn URL (optional email hint)."
          uses={[`preset: ${preset}`]}
          state={phone.state}
          disabled={!linkedinUrl.trim()}
          onRun={() =>
            void phone.run(
              "/api/explee/enrich/phone",
              {
                method: "POST",
                body: JSON.stringify({
                  linkedin_url: linkedinUrl,
                  ...(emailHint.trim() ? { email: emailHint.trim() } : {}),
                  preset,
                }),
              },
              { successToast: "Phone enrich complete" },
            )
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="LinkedIn URL">
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </Field>
            <Field label="Email hint" hint="optional">
              <Input
                value={emailHint}
                onChange={(e) => setEmailHint(e.target.value)}
              />
            </Field>
          </div>
        </EndpointCard>

        <EndpointCard
          title="Batch enrich email"
          method="POST"
          path="/api/explee/enrich/email/batch"
          description="Submit contacts JSON, then auto-poll task results."
          state={batch.state}
          runLabel="Start + poll"
          onRun={() => {
            let contacts: unknown = [];
            try {
              contacts = JSON.parse(batchJson);
            } catch {
              contacts = [];
            }
            void batch.run(
              "/api/explee/enrich/email/batch",
              {
                method: "POST",
                body: JSON.stringify({ contacts, preset }),
              },
              {
                pollPath: (id) => `/api/explee/enrich/email/batch/${id}`,
                successToast: "Batch enrich finished",
              },
            );
          }}
        >
          <Field label="Contacts JSON">
            <Textarea
              className="min-h-[150px] font-mono text-xs"
              value={batchJson}
              onChange={(e) => setBatchJson(e.target.value)}
            />
          </Field>
          <AdvancedFields>
            <Field label="Reset sample from form">
              <button
                type="button"
                className="text-left text-xs text-primary underline-offset-2 hover:underline"
                onClick={() => setBatchJson(batchDefault)}
              >
                Use current name/domain as sample payload
              </button>
            </Field>
          </AdvancedFields>
        </EndpointCard>

        <EndpointCard
          title="Poll batch task"
          method="GET"
          path="/api/explee/enrich/email/batch/:taskId"
          description="Manually poll an existing batch email task id."
          state={poll.state}
          disabled={!taskId.trim()}
          runLabel="Poll"
          onRun={() =>
            void poll.run(
              `/api/explee/enrich/email/batch/${encodeURIComponent(taskId.trim())}`,
              undefined,
              { successToast: "Batch status loaded" },
            )
          }
        >
          <Field label="Task id">
            <Input
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="task_…"
            />
          </Field>
        </EndpointCard>
      </div>
    </div>
  );
}
