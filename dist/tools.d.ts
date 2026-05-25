import { DisruptionApiClient } from "./client.js";
type JsonObject = Record<string, unknown>;
export type McpTool = {
    name: string;
    description: string;
    inputSchema: JsonObject;
};
export declare const tools: McpTool[];
export declare function callTool(name: string, args?: JsonObject, client?: DisruptionApiClient): Promise<unknown>;
export {};
