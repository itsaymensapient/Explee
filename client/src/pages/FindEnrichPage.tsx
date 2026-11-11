import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SharedContextPanel } from "@/components/SharedContextPanel";
import { EndpointCard } from "@/components/EndpointCard";
import { AdvancedFields } from "@/components/AdvancedFields";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";

export function FindEnrichPage() {
  const {
    inputs,
    titleList,
    geoList,
    criteriaList,
  } = useSharedInputs();
  const start = useApiAction();
  const poll = useApiAction();

  const [maxContacts, setMaxContacts] = useState("50");
  const [taskId, setTaskId] = useState("");
  const [definitionOverride, setDefinitionOverride] = useState("");
  const [titlesOverride, setTitlesOverride] = useState("");
  const [geoOverride, setGeoOverride] = useState("");
  const [criteriaOverride, setCriteriaOverride] = useState("");
  const [presetOverride, setPresetOverride] = useState("");

  const definition = definitionOverride || inputs.definition;
  const titles = titlesOverride
    ? titlesOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : titleList;
  const geo = geoOverride
    ? geoOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : geoList;
  const criteria = criteriaOverride
    ? criteriaOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : criteriaList;
  const preset = presetOverride || inputs.enrichPreset || "basic";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Find & Enrich"
        title="Async people pipeline"
        description="Start a find-and-enrich job from shared ICP/titles/geo, then poll until results land."
      />

      <SharedContextPanel compact />

      <div className="space-y-4">
        <EndpointCard
          title="Start find & enrich"
          method="POST"
          path="/api/explee/find-and-enrich"
          description="Creates an async task and automatically polls for completion."
          uses={[
            `definition: ${definition || "—"}`,
            `titles: ${titles.length}`,
            `max: ${maxContacts}`,
          ]}
          state={start.state}
          runLabel="Start + poll"
          disabled={titles.length === 0 || !definition}
          onRun={() =>
            void start.run(
              "/api/explee/find-and-enrich",
              {
                method: "POST",
                body: JSON.stringify({
                  people_filters: {
                    job_titles: titles,
                    ...(geo.length ? { geo } : {}),
                    ...(criteria.length ? { criteria } : {}),
                  },
                  company_filters: { definition },
                  max_contacts: Number(maxContacts) || 50,
                  preset,
                }),
              },
              {
                pollPath: (id) => `/api/explee/find-and-enrich/${id}`,
                successToast: "Find & enrich finished",
              },
            )
          }
        >
          <Field label="Max contacts">
            <Input
              value={maxContacts}
              onChange={(e) => setMaxContacts(e.target.value)}
            />
          </Field>
          <AdvancedFields>
            <Field label="Definition override">
              <Textarea
                value={definitionOverride}
                onChange={(e) => setDefinitionOverride(e.target.value)}
                placeholder={inputs.definition}
              />
            </Field>
            <Field label="Titles override">
              <Textarea
                value={titlesOverride}
                onChange={(e) => setTitlesOverride(e.target.value)}
                placeholder={inputs.jobTitles}
              />
            </Field>
            <Field label="Geography override">
              <Textarea
                value={geoOverride}
                onChange={(e) => setGeoOverride(e.target.value)}
                placeholder={inputs.geography}
              />
            </Field>
            <Field label="Criteria override">
              <Textarea
                value={criteriaOverride}
                onChange={(e) => setCriteriaOverride(e.target.value)}
                placeholder={inputs.criteria}
              />
            </Field>
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
          title="Poll find & enrich task"
          method="GET"
          path="/api/explee/find-and-enrich/:taskId"
          description="Check status/results for an existing task id."
          state={poll.state}
          disabled={!taskId.trim()}
          runLabel="Poll"
          onRun={() =>
            void poll.run(
              `/api/explee/find-and-enrich/${encodeURIComponent(taskId.trim())}`,
              undefined,
              { successToast: "Task status loaded" },
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
