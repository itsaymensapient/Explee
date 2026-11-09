import { useSharedInputs } from "@/context/SharedInputsContext";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SharedContextForm() {
  const { inputs, update } = useSharedInputs();

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-primary/80">
          Shared context
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">
          Inputs reused across APIs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Set ICP definition, titles, domains, geography, and project id once.
          Each API panel pulls what it needs and keeps endpoint-specific fields
          local.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="ICP / company definition" hint="search + find & enrich">
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
            placeholder={"Head of Sales\nVP Sales"}
          />
        </Field>
        <Field label="Domains" hint="comma or newline">
          <Textarea
            value={inputs.domains}
            onChange={(e) => update("domains", e.target.value)}
            placeholder={"acme.com\nexample.io"}
          />
        </Field>
        <Field label="Geography hints" hint="ISO-ish codes, one per line">
          <Textarea
            value={inputs.geography}
            onChange={(e) => update("geography", e.target.value)}
            placeholder={"US\nGB"}
          />
        </Field>
        <Field label="Project id" hint="AutoGTM" className="md:col-span-2">
          <Input
            value={inputs.projectId}
            onChange={(e) => update("projectId", e.target.value)}
            placeholder="123"
            inputMode="numeric"
          />
        </Field>
      </div>
    </section>
  );
}
