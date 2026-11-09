import { Router } from "express";
import { config, isKeyConfigured } from "../config.js";
import { expleeFetch } from "../explee/client.js";
import { sendMappedError } from "../explee/errors.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "explee-api-console",
    keyConfigured: isKeyConfigured(),
    baseUrl: config.expleeBaseUrl,
  });
});

healthRouter.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "explee-api-console",
    keyConfigured: isKeyConfigured(),
    baseUrl: config.expleeBaseUrl,
  });
});

/** Probe Explee without leaking the key. Uses GET /me when key is set. */
healthRouter.get("/api/explee/status", async (_req, res) => {
  const keyConfigured = isKeyConfigured();
  if (!keyConfigured) {
    res.json({
      ok: true,
      keyConfigured: false,
      me: null,
      balance: null,
    });
    return;
  }

  const me = await expleeFetch("GET", "/me");
  if (!me.ok) {
    sendMappedError(res, me.mapped);
    return;
  }

  const balance = await expleeFetch("GET", "/billing/balance");
  res.json({
    ok: true,
    keyConfigured: true,
    me: me.data,
    balance: balance.ok ? balance.data : null,
    balanceError: balance.ok ? null : balance.mapped,
  });
});
