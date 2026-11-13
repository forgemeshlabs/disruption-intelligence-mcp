import { DisruptionApiClient } from "./client.js";
const READ_ONLY_EXTERNAL = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
};
export const tools = [
    {
        name: "get_api_status",
        annotations: READ_ONLY_EXTERNAL,
        description: "Check the hosted Disruption Intelligence API health endpoint. Free.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "get_discovery_metadata",
        annotations: READ_ONLY_EXTERNAL,
        description: "Fetch free discovery metadata from index.json, llms.txt, openapi.json, and x402 well-known metadata. Free.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "inspect_x402_challenge",
        annotations: READ_ONLY_EXTERNAL,
        description: "Make an unpaid request to a paid endpoint and return the structured x402 payment challenge. Does not settle payment.",
        inputSchema: {
            type: "object",
            properties: {
                endpoint: {
                    type: "string",
                    description: "Paid endpoint path to inspect, on the Disruption Intelligence API only (letters, digits, / . _ -; no query string). Defaults to /territory/77001/disruption?radius=50.",
                    maxLength: 201,
                    pattern: "^/[A-Za-z0-9/._-]{1,200}$"
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "analyze_territory_disruption",
        annotations: READ_ONLY_EXTERNAL,
        description: "Territory layoff size index: workforce-disruption summary around a US ZIP code (GET /territory/:zip/disruption?radius=, $0.10). Returns as_of, a coverage block and a summary with disruption_score (a simple heuristic size index, 0-100), total_events, total_employees_affected, top industries and the largest filings. No geocoded notices in range is refused unpaid. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["zip"],
            properties: {
                zip: {
                    type: "string",
                    pattern: "^[0-9]{5}$",
                    description: "US ZIP code to analyze."
                },
                radius: {
                    type: "number",
                    description: "Search radius in miles (max 500). Defaults to 100 on the hosted API."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "search_company_context",
        annotations: READ_ONLY_EXTERNAL,
        description: "WARN Act layoffs company search: search the 4,389 employers that have filed WARN Act layoff notices in 40 US states (GET /companies/search?q=, $0.01). q needs at least 2 characters. Returns data (matching companies), total and as_of; no match is answered 404 unpaid. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["q"],
            properties: {
                q: {
                    type: "string",
                    maxLength: 2000,
                    description: "Company name, at least 2 characters."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_company_risk_summary",
        annotations: READ_ONLY_EXTERNAL,
        description: "Company layoff risk intelligence: heuristic workforce-disruption rollup for one employer (GET /companies/:id/intelligence, $0.05). Returns as_of and data with risk_tier, event_count, severity_avg, partial_inputs and business_sector_impacts (a static table keyed on the employer industry, empty when unknown). Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    maxLength: 128,
                    pattern: "^[A-Za-z0-9._-]{1,128}$",
                    description: "Company UUID (from the company search)."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_severity",
        annotations: READ_ONLY_EXTERNAL,
        description: "WARN layoff severity score: heuristic composite severity score (0-100) and risk tier for one WARN Act notice (GET /events/:id/severity, $0.01). Returns composite_score, risk_tier, scored_at, partial_inputs (components the source did not report) and industry_classification. Notices with too little data to score are refused unpaid. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    maxLength: 128,
                    pattern: "^[A-Za-z0-9._-]{1,128}$",
                    description: "WARN event UUID."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_company_intel",
        annotations: READ_ONLY_EXTERNAL,
        description: "Layoff event company intelligence: the employer behind one WARN Act notice (GET /events/:id/company-intel, $0.03). Returns the linked company profile, aliases, locations, industry_classification and business_sector_impacts (heuristic static table keyed on the employer industry, empty when unknown). Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    maxLength: 128,
                    pattern: "^[A-Za-z0-9._-]{1,128}$",
                    description: "WARN event UUID."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_history",
        annotations: READ_ONLY_EXTERNAL,
        description: "WARN notice amendment history: version-by-version history of one WARN Act layoff notice (GET /events/:id/history, $0.02). Returns event_id, version_count, as_of and versions with change reason, source and employee-count revisions; a notice never amended has one version. Replaces the removed event timeline route. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    maxLength: 128,
                    pattern: "^[A-Za-z0-9._-]{1,128}$",
                    description: "WARN event UUID."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "search_gold_inventory",
        annotations: READ_ONLY_EXTERNAL,
        description: "Free inventory-only Ripple signal search (GET /ripple/search). Returns match counts and unlock pricing without revealing signal details.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    maxLength: 2000,
                    description: "Optional commercial angle, company, region, or industry search query."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_ripple_index",
        annotations: READ_ONLY_EXTERNAL,
        description: "Layoff ripple signal index (GET /ripple/index, $0.01): location-only index of Ripple signals, heuristic readouts of downstream business effects of workforce disruption. Returns count, as_of and index cards (region, state, signal type, freshness); company names are withheld. No match is answered 404 unpaid.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    maxLength: 2000,
                    description: "Optional region, state, or broad signal search query."
                },
                scope: {
                    type: "string",
                    enum: ["all", "gold", "watchlist"],
                    description: "Index scope. Defaults to all on the hosted API."
                },
                limit: {
                    type: "number",
                    description: "Maximum index cards to return. Hosted API caps this at 25."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_gold_signals",
        annotations: READ_ONLY_EXTERNAL,
        description: "Layoff ripple signals: heuristic sales and market signals on downstream business effects of workforce disruption (GET /ripple/signals, $0.10). Returns count, as_of and signals with a commercial angle, heuristic score band and a link to sector-impact detail where it exists. Without q it returns a sampler diversified by event. No match is answered 404 unpaid.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    maxLength: 2000,
                    description: "Optional commercial angle, company, region, or industry search query."
                },
                limit: {
                    type: "number",
                    description: "Maximum signals to return. Hosted API caps this at 10."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_gold_brief",
        annotations: READ_ONLY_EXTERNAL,
        description: "Layoff ripple report: the Disruption Intelligence Ripple Report, a ranked heuristic brief on downstream business effects of workforce disruption (GET /ripple/brief, $0.25). Returns as_of, a readout (headline, commercial angle), inventory counts, top regions, recommended actions and delivered signals. No match is answered 404 unpaid.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    maxLength: 2000,
                    description: "Optional commercial angle, company, region, or industry search query."
                },
                scope: {
                    type: "string",
                    enum: ["all", "gold", "watchlist"],
                    description: "Brief scope. Defaults to all on the hosted API."
                },
                limit: {
                    type: "number",
                    description: "Maximum delivered signals to include. Hosted API caps this at 10."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_gold_sector_impacts",
        annotations: READ_ONLY_EXTERNAL,
        description: "Layoff sector impact paths: downstream vendor categories for one Ripple signal, from a heuristic static table keyed on the employer industry (GET /ripple/signals/:id/sector-impacts, $0.15). Returns impact_count, basis, matched_industries and business_sector_impacts (sector, spend_area, impact_path, buyer uses). Signals whose employer industry is unknown are answered 404 unpaid. Impacts are planning context, not confirmed purchases.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    maxLength: 128,
                    pattern: "^[A-Za-z0-9._-]{1,128}$",
                    description: "Ripple signal UUID."
                }
            },
            additionalProperties: false
        }
    }
];
export async function callTool(name, args = {}, client = new DisruptionApiClient()) {
    switch (name) {
        case "get_api_status":
            return client.get("/health");
        case "get_discovery_metadata":
            return client.getDiscoveryMetadata();
        case "inspect_x402_challenge":
            return inspectChallenge(client, endpointArg(args));
        case "analyze_territory_disruption": {
            const zip = requiredStringArg(args, "zip", /^[0-9]{5}$/);
            return client.get(withQuery(`/territory/${encodeURIComponent(zip)}/disruption`, { radius: numberArg(args, "radius") }));
        }
        case "search_company_context": {
            const q = requiredStringArg(args, "q");
            return client.get(`/companies/search?q=${encodeURIComponent(q)}`);
        }
        case "get_company_risk_summary": {
            const id = requiredStringArg(args, "id", ID_PATTERN);
            return client.get(`/companies/${encodeURIComponent(id)}/intelligence`);
        }
        case "get_event_severity": {
            const id = requiredStringArg(args, "id", ID_PATTERN);
            return client.get(`/events/${encodeURIComponent(id)}/severity`);
        }
        case "get_event_company_intel": {
            const id = requiredStringArg(args, "id", ID_PATTERN);
            return client.get(`/events/${encodeURIComponent(id)}/company-intel`);
        }
        case "get_event_history": {
            const id = requiredStringArg(args, "id", ID_PATTERN);
            return client.get(`/events/${encodeURIComponent(id)}/history`);
        }
        case "search_gold_inventory": {
            return client.get(withQuery("/ripple/search", { q: stringArg(args, "q") }));
        }
        case "get_ripple_index": {
            return client.get(withQuery("/ripple/index", {
                q: stringArg(args, "q"),
                scope: enumArg(args, "scope", ["all", "gold", "watchlist"]),
                limit: numberArg(args, "limit")
            }));
        }
        case "get_gold_signals": {
            return client.get(withQuery("/ripple/signals", {
                q: stringArg(args, "q"),
                limit: numberArg(args, "limit")
            }));
        }
        case "get_gold_brief": {
            return client.get(withQuery("/ripple/brief", {
                q: stringArg(args, "q"),
                scope: enumArg(args, "scope", ["all", "gold", "watchlist"]),
                limit: numberArg(args, "limit")
            }));
        }
        case "get_gold_sector_impacts": {
            const id = requiredStringArg(args, "id", ID_PATTERN);
            return client.get(`/ripple/signals/${encodeURIComponent(id)}/sector-impacts`);
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
async function inspectChallenge(client, endpoint) {
    const result = await client.get(endpoint);
    if (result.ok || result.status === 402) {
        return result;
    }
    return {
        ok: false,
        status: result.status,
        url: result.url,
        paymentRequired: false,
        error: {
            message: "Endpoint did not return an x402 payment challenge.",
            upstream: result.error
        }
    };
}
const MAX_TEXT = 2000;
const ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;
const ENDPOINT_PATTERN = /^\/[A-Za-z0-9/._-]{1,200}$/;
const DEFAULT_INSPECT_ENDPOINT = "/territory/77001/disruption?radius=50";
function requiredStringArg(args, key, pattern) {
    const value = args[key];
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing required string argument: ${key}`);
    }
    checkString(key, value, pattern);
    return value;
}
function checkString(key, value, pattern) {
    if (value.length > MAX_TEXT) {
        throw new Error(`${key} must be at most ${MAX_TEXT} characters`);
    }
    if (pattern && !pattern.test(value)) {
        throw new Error(`${key} has an invalid format`);
    }
}
// inspect_x402_challenge may only probe a plain path on the hard-coded API base.
function endpointArg(args) {
    const value = stringArg(args, "endpoint");
    if (value === undefined) {
        return DEFAULT_INSPECT_ENDPOINT;
    }
    if (!ENDPOINT_PATTERN.test(value) || value.split("/").includes("..")) {
        throw new Error("endpoint must be a plain path on the API (letters, digits, / . _ - only)");
    }
    return value;
}
function stringArg(args, key) {
    const value = args[key];
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Expected ${key} to be a non-empty string`);
    }
    checkString(key, value);
    return value;
}
function numberArg(args, key) {
    const value = args[key];
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error(`Expected ${key} to be a finite number`);
    }
    if (Math.abs(value) > 1_000_000) {
        throw new Error(`Expected ${key} to be between -1000000 and 1000000`);
    }
    return value;
}
function enumArg(args, key, allowed) {
    const value = args[key];
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "string" || !allowed.includes(value)) {
        throw new Error(`Expected ${key} to be one of: ${allowed.join(", ")}`);
    }
    return value;
}
function withQuery(path, params) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            query.set(key, String(value));
        }
    }
    const encoded = query.toString();
    return encoded ? `${path}?${encoded}` : path;
}
//# sourceMappingURL=tools.js.map