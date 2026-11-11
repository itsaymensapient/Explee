import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { SharedContextPanel } from "@/components/SharedContextPanel";
import { EndpointCard } from "@/components/EndpointCard";
import { AdvancedFields } from "@/components/AdvancedFields";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";

export function SearchPage() {
  const {
    inputs,
    domainList,
    titleList,
    geoList,
    criteriaList,
  } = useSharedInputs();

  const companies = useApiAction();
  const people = useApiAction();
  const nl = useApiAction();
  const companiesByDomains = useApiAction();
  const peopleByDomains = useApiAction();

  const [nlQuery, setNlQuery] = useState(
    () => `${inputs.definition} in ${geoList.join(", ") || "US"}`,
  );
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("10");
  const [peoplePerCompany, setPeoplePerCompany] = useState("3");
  const [definitionOverride, setDefinitionOverride] = useState("");
  const [titlesOverride, setTitlesOverride] = useState("");
  const [domainsOverride, setDomainsOverride] = useState("");
  const [geoOverride, setGeoOverride] = useState("");
  const [criteriaOverride, setCriteriaOverride] = useState("");

  const definition = definitionOverride || inputs.definition;
  const titles = titlesOverride
    ? titlesOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : titleList;
  const domains = domainsOverride
    ? domainsOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : domainList;
  const geo = geoOverride
    ? geoOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : geoList;
  const criteria = criteriaOverride
    ? criteriaOverride.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : criteriaList;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Search"
        title="Find companies & people"
        description="Run company and people discovery through the Express proxy. Shared context pre-fills filters; open a card, read the short guide, then only override inputs when you need to."
      />

      <PageIntro
        summary="Search endpoints turn ICP language and domain lists into Explee filter payloads. Nothing is sent until you press Run on a specific card."
        steps={[
          "Confirm Shared context has an ICP definition, titles, domains, and geography you care about.",
          "Pick one search flow below — each card explains what it calls and which shared fields it uses.",
          "Use Optional advanced only when you need a one-off override; then Run and inspect the JSON result.",
        ]}
      />

      <SharedContextPanel compact />

      <div className="space-y-5">
        <EndpointCard
          title="Search companies"
          method="POST"
          path="/api/explee/search/companies"
          description="Filter companies by ICP definition and optional criteria."
          howto={[
            "Uses shared ICP definition (and criteria if set).",
            "Adjust page / page size under Optional advanced when you need a different slice.",
            "Press Run to POST filters through /api/explee/search/companies.",
          ]}
          uses={[`definition: ${definition || "—"}`, `page ${page}`]}
          state={companies.state}
          onRun={() =>
            void companies.run(
              "/api/explee/search/companies",
              {
                method: "POST",
                body: JSON.stringify({
                  filters: {
                    definition,
                    ...(criteria.length ? { criteria } : {}),
                  },
                  page: Number(page) || 1,
                  page_size: Number(pageSize) || 10,
                }),
              },
              { successToast: "Companies search complete" },
            )
          }
        >
          <AdvancedFields>
            <Field label="Definition override">
              <Textarea
                value={definitionOverride}
                onChange={(e) => setDefinitionOverride(e.target.value)}
                placeholder={inputs.definition}
              />
            </Field>
            <Field label="Criteria override" hint="one per line">
              <Textarea
                value={criteriaOverride}
                onChange={(e) => setCriteriaOverride(e.target.value)}
                placeholder={inputs.criteria}
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
          </AdvancedFields>
        </EndpointCard>

        <EndpointCard
          title="Search people"
          method="POST"
          path="/api/explee/search/people"
          description="People filters + company ICP from shared context."
          howto={[
            "Titles and geography come from Shared context unless you override them.",
            "Company ICP still uses the shared definition.",
            "Run when titles look right — empty titles usually return poor coverage.",
          ]}
          uses={[
            `titles: ${titles.join(", ") || "—"}`,
            `geo: ${geo.join(", ") || "—"}`,
          ]}
          state={people.state}
          onRun={() =>
            void people.run(
              "/api/explee/search/people",
              {
                method: "POST",
                body: JSON.stringify({
                  people_filters: {
                    job_titles: titles,
                    ...(geo.length ? { geo } : {}),
                    ...(criteria.length ? { criteria } : {}),
                  },
                  company_filters: { definition },
                  page: Number(page) || 1,
                  page_size: Number(pageSize) || 10,
                }),
              },
              { successToast: "People search complete" },
            )
          }
        >
          <AdvancedFields>
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
          </AdvancedFields>
        </EndpointCard>

        <EndpointCard
          title="NL → filters"
          method="POST"
          path="/api/explee/search/nl-to-filters"
          description="Convert a natural-language ICP query into structured filters."
          howto={[
            "Write the ICP the way you would brief a researcher.",
            "Run to receive structured filters you can copy into other search calls.",
          ]}
          state={nl.state}
          onRun={() =>
            void nl.run(
              "/api/explee/search/nl-to-filters",
              {
                method: "POST",
                body: JSON.stringify({ query: nlQuery }),
              },
              { successToast: "Filters generated" },
            )
          }
        >
          <Field label="Query">
            <Textarea
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
            />
          </Field>
        </EndpointCard>

        <EndpointCard
          title="Companies by domains"
          method="POST"
          path="/api/explee/search/companies-by-domains"
          description="Resolve company records for a domain list."
          howto={[
            "Add one or more domains in Shared context first (or override below).",
            "Run to resolve company records for that domain list.",
          ]}
          uses={[`domains: ${domains.join(", ") || "set shared domains"}`]}
          state={companiesByDomains.state}
          disabled={domains.length === 0}
          onRun={() =>
            void companiesByDomains.run(
              "/api/explee/search/companies-by-domains",
              {
                method: "POST",
                body: JSON.stringify({ domains }),
              },
              { successToast: "Domain companies loaded" },
            )
          }
        >
          <AdvancedFields>
            <Field label="Domains override">
              <Textarea
                value={domainsOverride}
                onChange={(e) => setDomainsOverride(e.target.value)}
                placeholder={inputs.domains}
              />
            </Field>
          </AdvancedFields>
        </EndpointCard>

        <EndpointCard
          title="People by domains"
          method="POST"
          path="/api/explee/search/people-by-domains"
          description="Find people at given domains matching job titles."
          howto={[
            "Needs both domains and job titles from Shared context.",
            "Tune people-per-company under Optional advanced if you want denser coverage.",
            "Run only after both lists are non-empty.",
          ]}
          uses={[
            `domains: ${domains.length}`,
            `titles: ${titles.length}`,
          ]}
          state={peopleByDomains.state}
          disabled={domains.length === 0 || titles.length === 0}
          onRun={() =>
            void peopleByDomains.run(
              "/api/explee/search/people-by-domains",
              {
                method: "POST",
                body: JSON.stringify({
                  domains,
                  job_titles: titles,
                  people_per_company: Number(peoplePerCompany) || 3,
                }),
              },
              { successToast: "Domain people loaded" },
            )
          }
        >
          <AdvancedFields>
            <Field label="People per company">
              <Input
                value={peoplePerCompany}
                onChange={(e) => setPeoplePerCompany(e.target.value)}
              />
            </Field>
            <Field label="Domains override">
              <Textarea
                value={domainsOverride}
                onChange={(e) => setDomainsOverride(e.target.value)}
                placeholder={inputs.domains}
              />
            </Field>
            <Field label="Titles override">
              <Textarea
                value={titlesOverride}
                onChange={(e) => setTitlesOverride(e.target.value)}
                placeholder={inputs.jobTitles}
              />
            </Field>
          </AdvancedFields>
        </EndpointCard>
      </div>
    </div>
  );
}
