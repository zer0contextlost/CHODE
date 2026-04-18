#!/usr/bin/env node
/**
 * CHODE MCP Server — exposes chode_profile as an MCP tool.
 * AI assistants (Claude Desktop, Cursor, etc.) call this directly
 * instead of running the CLI manually.
 *
 * Add to claude_desktop_config.json:
 * {
 *   "mcpServers": {
 *     "chode": {
 *       "command": "node",
 *       "args": ["--experimental-strip-types", "/path/to/CHODE/src/mcp.ts"]
 *     }
 *   }
 * }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { generateProfile } from './generate.ts';
import { resolve } from 'node:path';
import { stat } from 'node:fs/promises';

const server = new Server(
  { name: 'chode', version: '2.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'chode_profile',
      description:
        'Generate a CHODE profile (~200-400 tokens) for a local repository. ' +
        'Returns the structured .chode file content — stack, routes, entry points, ' +
        'auth methods, conventions, and purpose — extracted in under a second without ' +
        'reading source code or calling an LLM. Use this to orient yourself to an ' +
        'unfamiliar codebase before asking questions about it.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Absolute path to the repository root directory',
          },
        },
        required: ['path'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'chode_profile') {
    const repoPath = args?.path as string | undefined;
    if (!repoPath) {
      return { content: [{ type: 'text', text: 'Error: path is required' }], isError: true };
    }

    const resolved = resolve(repoPath);

    try {
      const s = await stat(resolved);
      if (!s.isDirectory()) {
        return { content: [{ type: 'text', text: `Error: '${resolved}' is not a directory` }], isError: true };
      }
    } catch {
      return { content: [{ type: 'text', text: `Error: '${resolved}' does not exist` }], isError: true };
    }

    try {
      const profile = await generateProfile(resolved);
      return { content: [{ type: 'text', text: profile }] };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error generating profile: ${String(err)}` }], isError: true };
    }
  }

  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
});

const transport = new StdioServerTransport();
await server.connect(transport);
