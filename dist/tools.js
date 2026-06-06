import { DisruptionApiClient } from "./client.js";
export const tools = [
    {
        name: "get_api_status",
        description: "Check the hosted Disruption Intelligence API health endpoint. Free.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "get_discovery_metadata",
        description: "Fetch free discovery metadata from index.json, llms.txt, openapi.json, and x402 well-known metadata. Free.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "inspect_x402_challenge",
        description: "Make an unpaid request to a paid endpoint and return the structured x402 payment challenge. Does not settle payment.",
        inputSchema: {
            type: "object",
            properties: {
                endpoint: {
                    type: "string",
                    description: "Paid endpoint path to inspect. Defaults to /territory/77001/disruption?radius=50."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "analyze_territory_disruption",
        description: "Thin wrapper for GET /territory/:zip/disruption?radius=. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["zip"],
            properties: {
                zip: {
                    type: "string",
                    description: "US ZIP code to analyze."
                },
                radius: {
                    type: "number",
                    description: "Search radius in miles. Defaults to 50."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "search_company_context",
        description: "Thin wrapper for GET /companies/search?q=. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["q"],
            properties: {
                q: {
                    type: "string",
                    description: "Company search query."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_company_risk_summary",
        description: "Thin wrapper for GET /companies/:id/intelligence. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: "Company identifier accepted by the hosted API."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_severity",
        description: "Thin wrapper for GET /events/:id/severity. Paid endpoint; enriched paid responses include industry_classification with method, confidence, and coverage_note. Returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: "Event identifier accepted by the hosted API."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_company_intel",
        description: "Thin wrapper for GET /events/:id/company-intel. Paid endpoint; enriched paid responses include event industry_classification with method, confidence, and coverage_note. Returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: "Event identifier accepted by the hosted API."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_event_timeline",
        description: "Thin wrapper for GET /events/:id/timeline. Paid endpoint; returns x402 challenge in default non-settling mode.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: "Event identifier accepted by the hosted API."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "search_gold_inventory",
        description: "Free inventory-only search for commercially useful gold convergence signals. Returns counts and unlock pricing without revealing signal details.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    description: "Optional commercial angle, company, region, or industry search query."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_gold_signals",
        description: "Thin wrapper for GET /gold/signals. Paid endpoint currently priced at $0.10; returns distilled commercial convergence signals and sector-impact inventory, challenge-first by default.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
                    description: "Optional commercial angle, company, region, or industry search query."
                },
                limit: {
                    type: "number",
                    description: "Maximum signals to return. Hosted API caps this at 10."
                },
                state: {
                    type: "string",
                    enum: ["gold", "watchlist"],
                    description: "Signal state to request. Defaults to gold."
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "get_gold_brief",
        description: "Thin wrapper for GET /gold/brief. Paid endpoint currently priced at $0.10; returns a bounded commercial convergence brief, challenge-first by default.",
        inputSchema: {
            type: "object",
            properties: {
                q: {
                    type: "string",
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
        description: "Thin wrapper for GET /gold/signals/:id/sector-impacts. Paid endpoint currently priced at $0.15; returns deep operational spend and downstream sector impacts for one signal, challenge-first by default.",
        inputSchema: {
            type: "object",
            required: ["id"],
            properties: {
                id: {
                    type: "string",
                    description: "Gold signal UUID."
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
            return inspectChallenge(client, stringArg(args, "endpoint") ?? "/territory/77001/disruption?radius=50");
        case "analyze_territory_disruption": {
            const zip = requiredStringArg(args, "zip");
            const radius = numberArg(args, "radius") ?? 50;
            return client.get(`/territory/${encodeURIComponent(zip)}/disruption?radius=${encodeURIComponent(String(radius))}`);
        }
        case "search_company_context": {
            const q = requiredStringArg(args, "q");
            return client.get(`/companies/search?q=${encodeURIComponent(q)}`);
        }
        case "get_company_risk_summary": {
            const id = requiredStringArg(args, "id");
            return client.get(`/companies/${encodeURIComponent(id)}/intelligence`);
        }
        case "get_event_severity": {
            const id = requiredStringArg(args, "id");
            return client.get(`/events/${encodeURIComponent(id)}/severity`);
        }
        case "get_event_company_intel": {
            const id = requiredStringArg(args, "id");
            return client.get(`/events/${encodeURIComponent(id)}/company-intel`);
        }
        case "get_event_timeline": {
            const id = requiredStringArg(args, "id");
            return client.get(`/events/${encodeURIComponent(id)}/timeline`);
        }
        case "search_gold_inventory": {
            return client.get(withQuery("/gold/search", { q: stringArg(args, "q") }));
        }
        case "get_gold_signals": {
            return client.get(withQuery("/gold/signals", {
                q: stringArg(args, "q"),
                limit: numberArg(args, "limit"),
                state: enumArg(args, "state", ["gold", "watchlist"])
            }));
        }
        case "get_gold_brief": {
            return client.get(withQuery("/gold/brief", {
                q: stringArg(args, "q"),
                scope: enumArg(args, "scope", ["all", "gold", "watchlist"]),
                limit: numberArg(args, "limit")
            }));
        }
        case "get_gold_sector_impacts": {
            const id = requiredStringArg(args, "id");
            return client.get(`/gold/signals/${encodeURIComponent(id)}/sector-impacts`);
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
function requiredStringArg(args, key) {
    const value = args[key];
    if (typeof value !== "string" || value.trim() === "") {
        throw new Error(`Missing required string argument: ${key}`);
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