# Glama release build

Use this repository's Dockerfile for the Glama Dockerfile admin page:

```text
https://glama.ai/mcp/servers/forgemeshlabs/disruption-intelligence-mcp/admin/dockerfile
```

If the admin page asks for build steps, use:

```text
npm ci
npm run build
npm prune --omit=dev
```

CMD arguments:

```json
["node", "dist/index.js"]
```

Environment variables schema:

```json
{
  "type": "object",
  "properties": {
    "DISRUPTION_API_BASE": {
      "description": "Base URL for the Disruption Intelligence API.",
      "type": "string",
      "default": "https://disruption.forgemesh.io"
    },
    "X402_NETWORK": {
      "description": "Optional network identifier for future paid execution.",
      "type": "string"
    },
    "X402_PRIVATE_KEY": {
      "description": "Optional private key for future paid execution.",
      "type": "string"
    }
  },
  "required": []
}
```

Runtime notes:

- Transport: stdio
- Authentication: optional environment variables only
- No inbound HTTP port is required
