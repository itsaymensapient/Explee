# Explee API Integration Console

Dark Shadcn React (Vite) + Express console for connecting Explee MCP and running the main public REST API flows. The browser only talks to `/api/*`; `EXPLEE_API_KEY` stays on the server.

## Stack

- `client/` — Vite + React + TypeScript + Tailwind + Shadcn + Motion
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

Public base: `https://api.explee.com/public/api/v1`  
Auth header: `X-API-Key`  
Docs: [API docs](https://api.explee.com/public/api/docs) · [OpenAPI](https://api.explee.com/public/api/openapi.json)

```bash
cp .env.example .env
# edit .env — set EXPLEE_API_KEY=...
npm install
npm run dev
```

- UI: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001](http://localhost:3001)
- Health: `GET /api/health` → `{ ok, keyConfigured, baseUrl }` (never returns the key)

Optional env vars (see `.env.example`):

- `EXPLEE_BASE_URL` — default `https://api.explee.com/public/api/v1`
- `PORT` — default `3001`
- `CLIENT_ORIGIN` — default `http://localhost:5173`

## Implemented flows (v1)

Proxy paths mirror Explee under `/api/explee/...`:

1. **Search** — companies, people, nl-to-filters, companies-by-domains, people-by-domains
2. **Enrich** — email, phone, email batch POST + GET poll
3. **Find & enrich** — POST + GET poll
4. **AutoGTM core** — projects GET/POST, project by id, campaigns GET/POST, start/stop, hot leads, project inbox (read), billing balance, `/me`
5. **Connect guide** — README + in-app MCP/REST instructions

Out of v1: webhooks, suppress/dedup CRUD, my-copy, domain suggestions, autopilot, attachments, deep analytics.

## UI

- Central `/` page with shared context (ICP/definition, titles, domains, geography, project id)
- Accordion panels per capability with required fields, optional advanced, Run, and result panel
- Balance / key-configured chip when the server has a key

## Production build

```bash
npm run build
npm start
```

Serves the built client from Express on `PORT`.
