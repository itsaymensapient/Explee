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

export function FindEnrichSection() {
  const { inputs } = useSharedInputs();
  const action = useApiAction();
  const [maxContacts, setMaxContacts] = useState("50");
  const [preset, setPreset] = useState("basic");
  const [criteria, setCriteria] = useState("");
  const [taskIdOnly, setTaskIdOnly] = useState("");

  async function startJob() {
    const titles = splitLines(inputs.jobTitles);
    const geo = splitLines(inputs.geography);
    const criteriaList = splitLines(criteria);

    await action.run(
      "/api/explee/find-and-enrich",
      {
        method: "POST",
        body: JSON.stringify({
          people_filters: {
            job_titles: titles,
            ...(geo.length ? { geo } : {}),
            ...(criteriaList.length ? { criteria: criteriaList } : {}),
          },
          company_filters: {
            definition: inputs.definition,
          },
          max_contacts: Number(maxContacts) || 50,
          preset,
        }),
      },
      {
        pollPath: (taskId) => `/api/explee/find-and-enrich/${taskId}`,
      },
    );
  }

  async function pollExisting() {
    if (!taskIdOnly.trim()) return;
    await action.run(`/api/explee/find-and-enrich/${taskIdOnly.trim()}`);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Async find people matching shared ICP/titles/geo, enrich emails, then
        poll by task id.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Max contacts">
          <Input
            value={maxContacts}
            onChange={(e) => setMaxContacts(e.target.value)}
          />
        </Field>
        <Field label="Or poll existing task id">
          <Input
            value={taskIdOnly}
            onChange={(e) => setTaskIdOnly(e.target.value)}
            placeholder="task_…"
          />
        </Field>
      </div>

      <AdvancedFields>
        <Field label="People criteria" hint="optional">
          <Textarea
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            placeholder="Has lead gen experience"
          />
        </Field>
        <Field label="Preset">
          <Input value={preset} onChange={(e) => setPreset(e.target.value)} />
        </Field>
      </AdvancedFields>

      <div className="flex flex-wrap gap-2">
        <RunButton
          loading={action.state.loading}
          polling={action.state.polling}
          onClick={() => void startJob()}
          label="Start + poll"
        />
        <RunButton
          loading={action.state.loading}
          onClick={() => void pollExisting()}
          label="Poll task"
          disabled={!taskIdOnly.trim()}
        />
      </div>
      <ResultPanel state={action.state} />
    </div>
  );
}
