# Explee Control Dashboard

Production-style dark Shadcn React (Vite) + Express dashboard for operating Explee MCP connect docs and the main public REST flows. The browser only talks to `/api/*`; `EXPLEE_API_KEY` stays on the server.

## Stack

- `client/` — Vite + React + TypeScript + Tailwind + Shadcn + Motion + React Router
- `server/` — Express + TypeScript + dotenv + CORS
- Root `npm run dev` runs both concurrently

## Connect Explee MCP

| Client | MCP URL |
| --- | --- |
| Claude | `https://api.explee.com/public/api/mcp` |
| ChatGPT | `https://api.explee.com/public/api/mcp/chatgpt` |

1. Add a custom MCP connector with the URL for your client.
2. Complete OAuth for search / analysis tools.
3. For contact enrichment and campaign tools, create an Owner/Admin API key named **`Claude/ChatGPT connector`**.

## REST setup

```bash
cp .env.example .env
# set EXPLEE_API_KEY=...
npm install
npm run dev
```

- Dashboard UI: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001](http://localhost:3001)
- Health: `GET /api/health` → `{ ok, keyConfigured, baseUrl }` (never returns the key)

Optional env: `EXPLEE_BASE_URL`, `PORT`, `CLIENT_ORIGIN` (see `.env.example`).

## Dashboard sections

- **Overview** — connection/balance chips, shared context, quick balance/`/me`
- **Search** — companies, people, nl-to-filters, companies/people by domains
- **Enrich** — email, phone, batch email + poll
- **Find & Enrich** — async job + poll
- **AutoGTM** — projects, campaigns (create/start/stop), hot leads, inbox, balance, `/me`
- **Settings** — MCP + REST connect guide

Shared context (ICP, titles, domains, geography, project/campaign ids, criteria, preset) prefills every form; optional advanced overrides stay collapsed.

## Production build

```bash
npm run build
npm start
```
