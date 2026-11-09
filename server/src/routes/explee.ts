import { Router, type Request, type Response } from "express";
import { expleeFetch } from "../explee/client.js";
import { sendMappedError } from "../explee/errors.js";

export const expleeRouter = Router();

async function proxy(
  res: Response,
  method: string,
  path: string,
  options: {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined | null>;
    headers?: Record<string, string>;
  } = {},
): Promise<void> {
  const result = await expleeFetch(method, path, options);
  if (!result.ok) {
    sendMappedError(res, result.mapped);
    return;
  }
  res.status(result.status).json(result.data);
}

function queryFrom(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === "string") out[key] = value;
    else if (Array.isArray(value) && typeof value[0] === "string") {
      out[key] = value[0];
    }
  }
  return out;
}

// —— Search ——
expleeRouter.post("/search/companies", (req, res) =>
  proxy(res, "POST", "/search/companies", { body: req.body }),
);
expleeRouter.post("/search/people", (req, res) =>
  proxy(res, "POST", "/search/people", { body: req.body }),
);
expleeRouter.post("/search/nl-to-filters", (req, res) =>
  proxy(res, "POST", "/search/nl-to-filters", { body: req.body }),
);
expleeRouter.post("/search/companies-by-domains", (req, res) =>
  proxy(res, "POST", "/search/companies-by-domains", { body: req.body }),
);
expleeRouter.post("/search/people-by-domains", (req, res) =>
  proxy(res, "POST", "/search/people-by-domains", { body: req.body }),
);

// —— Enrich ——
expleeRouter.post("/enrich/email", (req, res) =>
  proxy(res, "POST", "/enrich/email", { body: req.body }),
);
expleeRouter.post("/enrich/phone", (req, res) =>
  proxy(res, "POST", "/enrich/phone", { body: req.body }),
);
expleeRouter.post("/enrich/email/batch", (req, res) =>
  proxy(res, "POST", "/enrich/email/batch", { body: req.body }),
);
expleeRouter.get("/enrich/email/batch/:taskId", (req, res) =>
  proxy(res, "GET", `/enrich/email/batch/${encodeURIComponent(req.params.taskId)}`),
);

// —— Find & enrich ——
expleeRouter.post("/find-and-enrich", (req, res) =>
  proxy(res, "POST", "/find-and-enrich", { body: req.body }),
);
expleeRouter.get("/find-and-enrich/:taskId", (req, res) =>
  proxy(res, "GET", `/find-and-enrich/${encodeURIComponent(req.params.taskId)}`),
);

// —— AutoGTM / billing / me ——
expleeRouter.get("/me", (_req, res) => proxy(res, "GET", "/me"));
expleeRouter.get("/billing/balance", (_req, res) =>
  proxy(res, "GET", "/billing/balance"),
);

expleeRouter.get("/autogtm/projects", (_req, res) =>
  proxy(res, "GET", "/autogtm/projects"),
);
expleeRouter.post("/autogtm/projects", (req, res) =>
  proxy(res, "POST", "/autogtm/projects", { body: req.body }),
);
expleeRouter.get("/autogtm/projects/:projectId", (req, res) =>
  proxy(res, "GET", `/autogtm/projects/${encodeURIComponent(req.params.projectId)}`),
);
expleeRouter.get("/autogtm/projects/:projectId/inbox", (req, res) =>
  proxy(res, "GET", `/autogtm/projects/${encodeURIComponent(req.params.projectId)}/inbox`, {
    query: queryFrom(req),
  }),
);

expleeRouter.get("/autogtm/campaigns", (req, res) =>
  proxy(res, "GET", "/autogtm/campaigns", { query: queryFrom(req) }),
);
expleeRouter.post("/autogtm/campaigns", (req, res) => {
  const idempotency = req.header("Idempotency-Key");
  proxy(res, "POST", "/autogtm/campaigns", {
    body: req.body,
    headers: idempotency ? { "Idempotency-Key": idempotency } : undefined,
  });
});
expleeRouter.get("/autogtm/campaigns/:campaignId", (req, res) =>
  proxy(res, "GET", `/autogtm/campaigns/${encodeURIComponent(req.params.campaignId)}`),
);
expleeRouter.post("/autogtm/campaigns/:campaignId/start", (req, res) =>
  proxy(
    res,
    "POST",
    `/autogtm/campaigns/${encodeURIComponent(req.params.campaignId)}/start`,
  ),
);
expleeRouter.post("/autogtm/campaigns/:campaignId/stop", (req, res) =>
  proxy(
    res,
    "POST",
    `/autogtm/campaigns/${encodeURIComponent(req.params.campaignId)}/stop`,
  ),
);

expleeRouter.get("/autogtm/hot-leads", (req, res) =>
  proxy(res, "GET", "/autogtm/hot-leads", { query: queryFrom(req) }),
);
