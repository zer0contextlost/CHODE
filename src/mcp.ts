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
import { resolve, sep } from 'node:path';
import { stat } from 'node:fs/promises';

// Fixes #4: block well-known sensitive system directories from being profiled.
// Developers legitimately keep repos in many locations, so a blocklist of
// dangerous root paths is safer than an over-restrictive allowlist.
const SENSITIVE_PATH_PREFIXES: string[] = [
  // Unix system directories
  '/etc', '/proc', '/sys', '/dev', '/run', '/boot', '/sbin',
  '/lib', '/lib64', '/usr/lib', '/usr/lib64',
  // macOS system
  '/private/etc', '/private/var',
  // Windows system directories (case-insensitive check applied below)
  'C:\\Windows', 'C:\\System32', 'C:\\Program Files', 'C:\\Program Files (x86)',
  'C:\\ProgramData', 'C:\\Recovery',
];

function isSensitivePath(resolved: string): boolean {
  const lower = resolved.toLowerCase();
  for (const prefix of SENSITIVE_PATH_PREFIXES) {
    const lp = prefix.toLowerCase();
    if (lower === lp || lower.startsWith(lp + '/') || lower.startsWith(lp + sep)) {
      return true;
    }
  }
  return false;
}

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

    // Fixes #4: reject sensitive system paths before walking the filesystem
    if (isSensitivePath(resolved)) {
      return { content: [{ type: 'text', text: `Error: '${resolved}' is a restricted system path` }], isError: true };
    }

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
