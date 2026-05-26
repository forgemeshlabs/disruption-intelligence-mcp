# Disruption Intelligence MCP

Public MCP server for geospatial disruption intelligence from WARN filings, labor signals, and regional economic events.

This package is a thin client around the hosted API:

`https://disruption.forgemesh.io`

Architecture:

`Agent/MCP client -> this MCP server -> hosted Disruption Intelligence API`

The MCP package does not contain engine internals, scoring logic, ingestion architecture, database schema, private topology, wallet addresses, or secrets.

## Install

```bash
npm install -g @forgemeshlabs/disruption-intelligence-mcp
```

Published package:

https://www.npmjs.com/package/@forgemeshlabs/disruption-intelligence-mcp

Source repo:

https://github.com/forgemeshlabs/disruption-intelligence-mcp

Local development:

```bash
npm install
npm run build
node dist/index.js
```

## Claude Desktop

Example config:

```json
{
  "mcpServers": {
    "disruption-intelligence": {
      "command": "npx",
      "args": ["@forgemeshlabs/disruption-intelligence-mcp"],
      "env": {
        "DISRUPTION_API_BASE": "https://disruption.forgemesh.io"
      }
    }
  }
}
```

See [examples/claude-desktop-config.json](examples/claude-desktop-config.json).

## Tools

| Tool | Endpoint | Cost behavior |
| --- | --- | --- |
| `get_api_status` | `GET /health` | Free |
| `get_discovery_metadata` | `GET /index.json`, `/llms.txt`, `/openapi.json`, `/.well-known/x402.json` | Free |
| `inspect_x402_challenge` | Unpaid request to a paid endpoint | Returns x402 challenge metadata |
| `analyze_territory_disruption` | `GET /territory/:zip/disruption?radius=` | Paid; challenge-first by default |
| `search_company_context` | `GET /companies/search?q=` | Paid; challenge-first by default |
| `get_company_risk_summary` | `GET /companies/:id/intelligence` | Paid; challenge-first by default |
| `get_event_timeline` | `GET /events/:id/timeline` | Paid; challenge-first by default |

## Free vs Paid Behavior

Default mode is safe and non-settling. Free endpoints return API data directly. Paid endpoints are requested without payment credentials, so the hosted API can return an x402 `402 Payment Required` challenge.

When payment is required, this MCP returns structured payment instructions and challenge metadata instead of dumping an upstream error. It does not require a private key and does not settle payments.

Future paid execution should be opt-in and delegated to a trusted wallet or payment client.

## Configuration

```bash
DISRUPTION_API_BASE=https://disruption.forgemesh.io
```

Future optional environment names may include:

```bash
X402_PRIVATE_KEY=
X402_NETWORK=
```

Those values are not required in v1 and should not be pasted into chat, logs, or MCP client prompts.

## Public API Docs

Public API docs and product context:

https://github.com/forgemeshlabs/disruption-intelligence

Hosted API:

https://disruption.forgemesh.io

## Security Boundary

This repository is public-facing only. It is a thin client wrapper around the hosted API. It intentionally excludes engine code, scoring formulas, ingestion internals, database details, operational topology, wallet addresses, private keys, and secrets.
