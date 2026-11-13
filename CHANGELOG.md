# Changelog

## 0.2.0

- Removed `get_event_timeline`: the live route is delisted (503, relationship and lifecycle data not populated). Added `get_event_history` for `/events/:id/history`.
- Removed the `state` parameter of `get_gold_signals` (not accepted by the live route).
- `analyze_territory_disruption`: `radius` is optional (max 500, hosted default 100); the package no longer forces 50.
- Tool descriptions match the live routes: 4,389 employers in 40 US states, heuristic scores, refusals answered unpaid.
- Upstream refusals (status, `error`, `message`, `charged:false`) are returned in full instead of a truncated string.

## 0.1.11

- Dependencies: lockfile refresh resolving the open npm advisories (zod via @x402/core, body-parser, fast-uri, qs, ip-address, @hono/node-server as applicable). No behavior change.

## 0.1.4

- Added Glama registry metadata for ForgeMesh maintainer verification.
- Published Disruption Intelligence MCP server for local stdio use.
