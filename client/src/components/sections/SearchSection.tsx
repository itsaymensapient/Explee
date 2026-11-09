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

type SearchKind =
  | "companies"
  | "people"
  | "nl-to-filters"
  | "companies-by-domains"
  | "people-by-domains";

export function SearchSection() {
  const { inputs } = useSharedInputs();
  const action = useApiAction();
  const [kind, setKind] = useState<SearchKind>("companies");
  const [nlQuery, setNlQuery] = useState("SaaS companies using Stripe");
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("10");
  const [peoplePerCompany, setPeoplePerCompany] = useState("3");
  const [criteria, setCriteria] = useState("");

  async function run() {
    const titles = splitLines(inputs.jobTitles);
    const domains = splitLines(inputs.domains);
    const geo = splitLines(inputs.geography);
    const criteriaList = splitLines(criteria);

    if (kind === "companies") {
      await action.run("/api/explee/search/companies", {
        method: "POST",
        body: JSON.stringify({
          filters: {
            definition: inputs.definition,
            ...(criteriaList.length ? { criteria: criteriaList } : {}),
          },
          page: Number(page) || 1,
          page_size: Number(pageSize) || 10,
        }),
      });
      return;
    }

    if (kind === "people") {
      await action.run("/api/explee/search/people", {
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
          page: Number(page) || 1,
          page_size: Number(pageSize) || 10,
        }),
      });
      return;
    }

    if (kind === "nl-to-filters") {
      await action.run("/api/explee/search/nl-to-filters", {
        method: "POST",
        body: JSON.stringify({ query: nlQuery }),
      });
      return;
    }

    if (kind === "companies-by-domains") {
      await action.run("/api/explee/search/companies-by-domains", {
        method: "POST",
        body: JSON.stringify({ domains }),
      });
      return;
    }

    await action.run("/api/explee/search/people-by-domains", {
      method: "POST",
      body: JSON.stringify({
        domains,
        job_titles: titles,
        people_per_company: Number(peoplePerCompany) || 3,
      }),
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Search companies and people, convert natural language to filters, or
        resolve contacts by domain list.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["companies", "Companies"],
            ["people", "People"],
            ["nl-to-filters", "NL → filters"],
            ["companies-by-domains", "Companies by domains"],
            ["people-by-domains", "People by domains"],
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

      {kind === "nl-to-filters" ? (
        <Field label="Natural language query">
          <Textarea value={nlQuery} onChange={(e) => setNlQuery(e.target.value)} />
        </Field>
      ) : null}

      {(kind === "companies" || kind === "people") && (
        <p className="text-xs text-muted-foreground">
          Uses shared definition
          {kind === "people" ? ", job titles, and geography" : ""}.
        </p>
      )}

      {(kind === "companies-by-domains" || kind === "people-by-domains") && (
        <p className="text-xs text-muted-foreground">
          Uses shared domains
          {kind === "people-by-domains" ? " and job titles" : ""}.
        </p>
      )}

      <AdvancedFields>
        {(kind === "companies" || kind === "people") && (
          <>
            <Field label="Extra criteria" hint="optional, one per line">
              <Textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder="Has enterprise customers"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Page">
                <Input value={page} onChange={(e) => setPage(e.target.value)} />
              </Field>
              <Field label="Page size">
                <Input
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                />
              </Field>
            </div>
          </>
        )}
        {kind === "people-by-domains" && (
          <Field label="People per company">
            <Input
              value={peoplePerCompany}
              onChange={(e) => setPeoplePerCompany(e.target.value)}
            />
          </Field>
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
