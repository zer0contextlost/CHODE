#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, '../src/index.ts');
const args = process.argv.slice(2);

// Prefer Bun; fall back to Node 22.6+ with experimental TS stripping
let result = spawnSync('bun', ['run', entry, ...args], { stdio: 'inherit', env: process.env });
if (result.error) {
  result = spawnSync(process.execPath, ['--experimental-strip-types', entry, ...args], { stdio: 'inherit', env: process.env });
  if (result.error) {
    process.stderr.write('chode requires Bun or Node.js 22.6+\n');
    process.exit(1);
  }
}
process.exit(result.status ?? 1);
