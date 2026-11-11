import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { expleeRouter } from "./routes/explee.js";
import { healthRouter } from "./routes/health.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.use(healthRouter);
app.use("/api/explee", expleeRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found", code: "not_found" });
});

const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }
  if (req.path.startsWith("/api") || req.path === "/health") {
    next();
    return;
  }
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
      code: "internal_error",
    });
  },
);

app.listen(config.port, () => {
  console.log(
    `Explee console API listening on http://localhost:${config.port} (key configured: ${Boolean(config.expleeApiKey)})`,
  );
});
