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
//# sourceMappingURL=tools.js.map