# Submission Notes

## GitHub

Repository: `forgemeshlabs/disruption-intelligence-mcp`

Description:

MCP server for geospatial disruption intelligence from WARN filings, labor signals, and regional economic events.

Topics:

`mcp`, `x402`, `agents`, `ai-agents`, `api`, `usdc`, `base`, `workforce-intelligence`, `economic-signals`, `disruption-intelligence`, `warn`, `warn-filings`, `commercial-real-estate`, `cre`, `site-selection`, `risk-intelligence`

## npm

Package name:

`@forgemeshlabs/disruption-intelligence-mcp`

Status:

Published as `0.1.0`.

URL:

https://www.npmjs.com/package/@forgemeshlabs/disruption-intelligence-mcp

Install:

`npx -y @forgemeshlabs/disruption-intelligence-mcp`

Keywords:

`mcp`, `model-context-protocol`, `x402`, `agent-payments`, `disruption-intelligence`, `market-intelligence`, `commercial-intelligence`, `location-intelligence`, `risk-intelligence`, `enterprise-risk`, `economic-signals`, `warn`, `warn-filings`, `layoffs`, `commercial-real-estate`, `cre`, `site-selection`, `competitive-intelligence`, `geospatial-intelligence`, `signal-api`

## Marketplace Description

Short:

Connect AI agents to hosted Disruption Intelligence APIs for regional disruption, company context, and event timeline lookups with x402 challenge-first paid endpoint support.

Long:

Disruption Intelligence MCP is a public, thin MCP wrapper around the hosted Disruption Intelligence API. It lets agents inspect service health, read discovery metadata, and request geospatial disruption intelligence from WARN filings, labor signals, and regional economic events. Paid endpoints default to safe, non-settling x402 challenge inspection, so agents can understand price and payment requirements without handling private keys or initiating settlement inside the MCP server.

## Sample Prompts

- "Check the Disruption Intelligence API status."
- "Show me the public discovery metadata for Disruption Intelligence."
- "Inspect the x402 challenge for a territory disruption request."
- "Analyze disruption risk around ZIP 77001 within 50 miles."
- "Search company context for a regional employer."
- "Get the event timeline for this disruption event ID."

## Safety And Privacy Notes

- Default mode does not require private keys.
- Paid endpoint calls return x402 challenge metadata unless the user configures a trusted payment flow outside this package.
- Do not paste private keys, wallet seed phrases, API keys, or secrets into MCP client chats or logs.
- This package contains no engine internals, scoring formulas, ingestion architecture, database schema, or operational topology.
- The MCP server forwards requests only to the configured hosted API base.

## Screenshots / Assets Checklist

- API health tool response screenshot.
- Discovery metadata tool response screenshot.
- x402 challenge inspection screenshot.
- Claude Desktop configuration screenshot.
- Package logo or square marketplace icon, if required by the target directory.
