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
    <section className="space-y-5 rounded-lg border border-border/70 bg-card/40 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-medium tracking-wide text-gold">
            Shared context
          </p>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Set these once, reuse everywhere
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {compact
              ? "Values below already prefill this page. Adjust here if you want every endpoint on this screen to inherit the same ICP, titles, domains, and IDs — then open each card to review what will be sent."
              : "Fill the fields below before jumping into Search, Enrich, Find & Enrich, or AutoGTM. Each panel reads this shared context first, so you are not retyping the same ICP, titles, domains, or project IDs. Per-endpoint overrides stay under Optional advanced."}
          </p>
          {!compact ? (
            <ol className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
              <li className="rounded-md border border-border/60 bg-background/35 px-3 py-2">
                <span className="font-mono text-[11px] text-gold">01</span>{" "}
                Describe the ICP and titles you care about.
              </li>
              <li className="rounded-md border border-border/60 bg-background/35 px-3 py-2">
                <span className="font-mono text-[11px] text-gold">02</span>{" "}
                Add domains / geography used by enrich and search.
              </li>
              <li className="rounded-md border border-border/60 bg-background/35 px-3 py-2">
                <span className="font-mono text-[11px] text-gold">03</span>{" "}
                Optionally set project / campaign IDs for AutoGTM.
              </li>
            </ol>
          ) : null}
        </div>
        <Badge variant="outline">Stays in this browser</Badge>
      </div>

      <div className="grid gap-4 border-t border-border/50 pt-5 md:grid-cols-2">
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
