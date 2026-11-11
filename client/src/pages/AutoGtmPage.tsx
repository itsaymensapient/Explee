import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SharedContextPanel } from "@/components/SharedContextPanel";
import { EndpointCard } from "@/components/EndpointCard";
import { AdvancedFields } from "@/components/AdvancedFields";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSharedInputs } from "@/context/SharedInputsContext";
import { useApiAction } from "@/hooks/useApiAction";

export function AutoGtmPage() {
  const { inputs, firstDomain, titleList, geoList, update } = useSharedInputs();

  const listProjects = useApiAction();
  const createProject = useApiAction();
  const getProject = useApiAction();
  const listCampaigns = useApiAction();
  const createCampaign = useApiAction();
  const startCampaign = useApiAction();
  const stopCampaign = useApiAction();
  const hotLeads = useApiAction();
  const inbox = useApiAction();
  const balance = useApiAction();
  const me = useApiAction();

  const [domainOverride, setDomainOverride] = useState("");
  const [senderName, setSenderName] = useState("");
  const [campaignName, setCampaignName] = useState("Outbound pilot");
  const [offer, setOffer] = useState("");
  const [customerProblem, setCustomerProblem] = useState("");
  const [targetRoleOverride, setTargetRoleOverride] = useState("");
  const [campaignIdOverride, setCampaignIdOverride] = useState("");

  const projectId = inputs.projectId.trim();
  const campaignId = (campaignIdOverride || inputs.campaignId).trim();
  const domain = domainOverride.trim() || firstDomain;
  const targetRole =
    targetRoleOverride.trim() || titleList.join(", ") || "";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AutoGTM"
        title="Projects & campaigns"
        description="Core AutoGTM operations: projects, campaigns, hot leads, inbox, and billing probes."
      />

      <SharedContextPanel compact />

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="leads">Leads & inbox</TabsTrigger>
          <TabsTrigger value="billing">Billing / me</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <EndpointCard
            title="List projects"
            method="GET"
            path="/api/explee/autogtm/projects"
            description="List outreach projects for the keyed organization."
            state={listProjects.state}
            onRun={() =>
              void listProjects.run("/api/explee/autogtm/projects", undefined, {
                successToast: "Projects loaded",
              })
            }
          />

          <EndpointCard
            title="Create project"
            method="POST"
            path="/api/explee/autogtm/projects"
            description="Create a project from a product domain (shared domains prefill)."
            uses={[`domain: ${domain || "required"}`]}
            state={createProject.state}
            disabled={!domain}
            onRun={() =>
              void createProject.run(
                "/api/explee/autogtm/projects",
                {
                  method: "POST",
                  body: JSON.stringify({
                    domain,
                    sender_name: senderName.trim() || null,
                  }),
                },
                { successToast: "Project create accepted" },
              )
            }
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Domain" hint="defaults to shared">
                <Input
                  value={domainOverride}
                  onChange={(e) => setDomainOverride(e.target.value)}
                  placeholder={firstDomain || "yourproduct.com"}
                />
              </Field>
              <Field label="Sender name" hint="optional">
                <Input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </Field>
            </div>
          </EndpointCard>

          <EndpointCard
            title="Get project"
            method="GET"
            path="/api/explee/autogtm/projects/:id"
            description="Fetch one project by shared project id."
            uses={[`project: ${projectId || "set shared project id"}`]}
            state={getProject.state}
            disabled={!projectId}
            onRun={() =>
              void getProject.run(
                `/api/explee/autogtm/projects/${encodeURIComponent(projectId)}`,
                undefined,
                { successToast: "Project loaded" },
              )
            }
          >
            <Field label="Project id" hint="writes to shared context">
              <Input
                value={inputs.projectId}
                onChange={(e) => update("projectId", e.target.value)}
                placeholder="123"
              />
            </Field>
          </EndpointCard>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <EndpointCard
            title="List campaigns"
            method="GET"
            path="/api/explee/autogtm/campaigns"
            description="List campaigns, optionally filtered by shared project id."
            uses={[`project: ${projectId || "all"}`]}
            state={listCampaigns.state}
            onRun={() =>
              void listCampaigns.run(
                `/api/explee/autogtm/campaigns${
                  projectId
                    ? `?project_id=${encodeURIComponent(projectId)}`
                    : ""
                }`,
                undefined,
                { successToast: "Campaigns loaded" },
              )
            }
          />

          <EndpointCard
            title="Create campaign"
            method="POST"
            path="/api/explee/autogtm/campaigns"
            description="Create a campaign under the shared project using ICP defaults."
            uses={[
              `project: ${projectId || "required"}`,
              `role: ${targetRole || "—"}`,
            ]}
            state={createCampaign.state}
            disabled={!projectId || !campaignName.trim()}
            onRun={() =>
              void createCampaign.run(
                "/api/explee/autogtm/campaigns",
                {
                  method: "POST",
                  body: JSON.stringify({
                    project_id: Number(projectId),
                    name: campaignName,
                    offer: offer || null,
                    customer_problem: customerProblem || null,
                    target_role: targetRole || null,
                    target_geography: geoList.join(", ") || null,
                  }),
                },
                { successToast: "Campaign created" },
              )
            }
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Campaign name">
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </Field>
              <Field label="Target role" hint="defaults to shared titles">
                <Input
                  value={targetRoleOverride}
                  onChange={(e) => setTargetRoleOverride(e.target.value)}
                  placeholder={titleList.join(", ")}
                />
              </Field>
            </div>
            <AdvancedFields>
              <Field label="Offer">
                <Textarea
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </Field>
              <Field label="Customer problem">
                <Textarea
                  value={customerProblem}
                  onChange={(e) => setCustomerProblem(e.target.value)}
                />
              </Field>
            </AdvancedFields>
          </EndpointCard>

          <div className="grid gap-4 lg:grid-cols-2">
            <EndpointCard
              title="Start campaign"
              method="POST"
              path="/api/explee/autogtm/campaigns/:id/start"
              description="Start outreach for a campaign id."
              uses={[`campaign: ${campaignId || "required"}`]}
              state={startCampaign.state}
              disabled={!campaignId}
              onRun={() =>
                void startCampaign.run(
                  `/api/explee/autogtm/campaigns/${encodeURIComponent(campaignId)}/start`,
                  { method: "POST" },
                  { successToast: "Campaign started" },
                )
              }
            >
              <Field label="Campaign id">
                <Input
                  value={campaignIdOverride || inputs.campaignId}
                  onChange={(e) => {
                    setCampaignIdOverride(e.target.value);
                    update("campaignId", e.target.value);
                  }}
                  placeholder="456"
                />
              </Field>
            </EndpointCard>

            <EndpointCard
              title="Stop campaign"
              method="POST"
              path="/api/explee/autogtm/campaigns/:id/stop"
              description="Stop an active campaign."
              uses={[`campaign: ${campaignId || "required"}`]}
              state={stopCampaign.state}
              disabled={!campaignId}
              onRun={() =>
                void stopCampaign.run(
                  `/api/explee/autogtm/campaigns/${encodeURIComponent(campaignId)}/stop`,
                  { method: "POST" },
                  { successToast: "Campaign stopped" },
                )
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <EndpointCard
            title="Hot leads"
            method="GET"
            path="/api/explee/autogtm/hot-leads"
            description="List hot leads filtered by shared project and/or campaign."
            uses={[
              `project: ${projectId || "optional"}`,
              `campaign: ${campaignId || "optional"}`,
            ]}
            state={hotLeads.state}
            onRun={() => {
              const params = new URLSearchParams();
              if (projectId) params.set("project_id", projectId);
              if (campaignId) params.set("campaign_id", campaignId);
              const qs = params.toString();
              void hotLeads.run(
                `/api/explee/autogtm/hot-leads${qs ? `?${qs}` : ""}`,
                undefined,
                { successToast: "Hot leads loaded" },
              );
            }}
          />

          <EndpointCard
            title="Project inbox"
            method="GET"
            path="/api/explee/autogtm/projects/:id/inbox"
            description="Read project inbox conversations (no write actions in v1)."
            uses={[`project: ${projectId || "required"}`]}
            state={inbox.state}
            disabled={!projectId}
            onRun={() =>
              void inbox.run(
                `/api/explee/autogtm/projects/${encodeURIComponent(projectId)}/inbox`,
                undefined,
                { successToast: "Inbox loaded" },
              )
            }
          />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <EndpointCard
            title="Billing balance"
            method="GET"
            path="/api/explee/billing/balance"
            description="Fetch current Explee credit balance."
            state={balance.state}
            onRun={() =>
              void balance.run("/api/explee/billing/balance", undefined, {
                successToast: "Balance loaded",
              })
            }
          />
          <EndpointCard
            title="Me / key owner"
            method="GET"
            path="/api/explee/me"
            description="Identity probe for the configured server API key."
            state={me.state}
            onRun={() =>
              void me.run("/api/explee/me", undefined, {
                successToast: "Identity loaded",
              })
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
