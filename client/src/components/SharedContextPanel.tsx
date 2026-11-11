import { useSharedInputs } from "@/context/SharedInputsContext";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function SharedContextPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { inputs, update } = useSharedInputs();

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4 md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary/80">
            Shared context
          </p>
          <h2 className="mt-1 font-display text-xl font-medium tracking-tight">
            Global inputs
          </h2>
          {!compact ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              These values prefill Search, Enrich, Find & Enrich, and AutoGTM.
              Override per endpoint in optional advanced fields.
            </p>
          ) : null}
        </div>
        <Badge variant="outline">Client-side only</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="ICP / company definition">
          <Textarea
            value={inputs.definition}
            onChange={(e) => update("definition", e.target.value)}
            placeholder="B2B SaaS company"
          />
        </Field>
        <Field label="Job titles" hint="one per line">
          <Textarea
            value={inputs.jobTitles}
            onChange={(e) => update("jobTitles", e.target.value)}
          />
        </Field>
        <Field label="Domains" hint="comma or newline">
          <Textarea
            value={inputs.domains}
            onChange={(e) => update("domains", e.target.value)}
          />
        </Field>
        <Field label="Geography" hint="e.g. US, GB">
          <Textarea
            value={inputs.geography}
            onChange={(e) => update("geography", e.target.value)}
          />
        </Field>
        <Field label="Shared criteria" hint="optional people/company criteria">
          <Textarea
            value={inputs.criteria}
            onChange={(e) => update("criteria", e.target.value)}
          />
        </Field>
        <Field label="Enrich preset">
          <Input
            value={inputs.enrichPreset}
            onChange={(e) => update("enrichPreset", e.target.value)}
          />
        </Field>
        <Field label="Project id">
          <Input
            value={inputs.projectId}
            onChange={(e) => update("projectId", e.target.value)}
            placeholder="123"
            inputMode="numeric"
          />
        </Field>
        <Field label="Campaign id">
          <Input
            value={inputs.campaignId}
            onChange={(e) => update("campaignId", e.target.value)}
            placeholder="456"
            inputMode="numeric"
          />
        </Field>
      </div>
    </section>
  );
}
