import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  parseGoMod,
  parseCargoToml,
  parsePyProject,
  parseGemfile,
  parsePomXml,
  parseComposerJson,
  parseMixExs,
} from '../src/ingest/manifest.ts';
import { cavemanCompress } from '../src/ingest/context.ts';
import { globToRegex } from '../src/crawler/walker.ts';

// ── Fixture helpers ───────────────────────────────────────────────────────────

let tmp: string;
before(async () => { tmp = await mkdtemp(join(tmpdir(), 'chode-test-')); });
after(async () => { await rm(tmp, { recursive: true, force: true }); });

async function fixture(name: string, content: string): Promise<string> {
  const p = join(tmp, name);
  await writeFile(p, content, 'utf8');
  return p;
}

// ── manifest parsers ──────────────────────────────────────────────────────────

describe('parseGoMod', () => {
  test('extracts module name and block deps', async () => {
    const p = await fixture('go.mod', `module github.com/acme/myapp\n\ngo 1.21\n\nrequire (\n\tgithub.com/gin-gonic/gin v1.9.1\n\tgolang.org/x/sys v0.15.0 // indirect\n)\n`);
    const r = await parseGoMod(p);
    assert.equal(r.module, 'github.com/acme/myapp');
    assert.ok(r.deps.includes('github.com/gin-gonic/gin'));
    assert.ok(r.deps.includes('golang.org/x/sys'));
  });

  test('extracts single-line require', async () => {
    const p = await fixture('go2.mod', `module example.com/foo\nrequire github.com/pkg/errors v0.9.1\n`);
    const r = await parseGoMod(p);
    assert.ok(r.deps.includes('github.com/pkg/errors'));
  });

  test('returns empty deps when no require block', async () => {
    const p = await fixture('go3.mod', `module example.com/empty\ngo 1.21\n`);
    const r = await parseGoMod(p);
    assert.deepEqual(r.deps, []);
  });
});

describe('parseCargoToml', () => {
  test('extracts package name and deps', async () => {
    const p = await fixture('Cargo.toml', `[package]\nname = "my-crate"\nversion = "0.1.0"\n\n[dependencies]\nserde = { version = "1.0", features = ["derive"] }\ntokio = "1"\n`);
    const r = await parseCargoToml(p);
    assert.equal(r.name, 'my-crate');
    assert.ok(r.deps.includes('serde'));
    assert.ok(r.deps.includes('tokio'));
  });

  test('returns empty name when no [package] section', async () => {
    const p = await fixture('Cargo2.toml', `[dependencies]\nanyhow = "1"\n`);
    const r = await parseCargoToml(p);
    assert.equal(r.name, '');
    assert.ok(r.deps.includes('anyhow'));
  });
});

describe('parsePyProject', () => {
  test('extracts name and deps from [project]', async () => {
    const p = await fixture('pyproject.toml', `[project]\nname = "mypackage"\nversion = "0.1.0"\ndependencies = [\n  "requests>=2.28",\n  "fastapi[all]>=0.100",\n]\n`);
    const r = await parsePyProject(p);
    assert.equal(r.name, 'mypackage');
    assert.ok(r.deps.includes('requests'));
    assert.ok(r.deps.includes('fastapi'));
  });

  test('strips version specifiers from dep names', async () => {
    const p = await fixture('pyproject2.toml', `[project]\nname = "x"\ndependencies = [\n  "pydantic~=2.0",\n  "httpx!=0.24",\n]\n`);
    const r = await parsePyProject(p);
    assert.ok(r.deps.includes('pydantic'));
    assert.ok(r.deps.includes('httpx'));
  });
});

describe('parseGemfile', () => {
  test('extracts gem names', async () => {
    const p = await fixture('Gemfile', `source "https://rubygems.org"\ngem 'rails', '~> 7.0'\ngem "devise"\n# gem 'commented_out'\n`);
    const r = await parseGemfile(p);
    assert.ok(r.deps.includes('rails'));
    assert.ok(r.deps.includes('devise'));
    assert.ok(!r.deps.includes('commented_out'));
  });
});

describe('parsePomXml', () => {
  test('extracts unique groupIds', async () => {
    const p = await fixture('pom.xml', `<project>\n  <dependencies>\n    <dependency>\n      <groupId>org.springframework</groupId>\n      <artifactId>spring-core</artifactId>\n    </dependency>\n    <dependency>\n      <groupId>org.springframework</groupId>\n      <artifactId>spring-web</artifactId>\n    </dependency>\n    <dependency>\n      <groupId>com.fasterxml.jackson.core</groupId>\n      <artifactId>jackson-databind</artifactId>\n    </dependency>\n  </dependencies>\n</project>\n`);
    const r = await parsePomXml(p);
    assert.ok(r.deps.includes('org.springframework'));
    assert.ok(r.deps.includes('com.fasterxml.jackson.core'));
    assert.equal(r.deps.filter(d => d === 'org.springframework').length, 1, 'deduplicates groupIds');
  });
});

describe('parseComposerJson', () => {
  test('extracts dep names from require and require-dev, strips vendor prefix', async () => {
    const p = await fixture('composer.json', JSON.stringify({
      require: { 'php': '>=8.1', 'laravel/framework': '^10.0' },
      'require-dev': { 'phpunit/phpunit': '^10.0' },
    }));
    const r = await parseComposerJson(p);
    assert.ok(!r.deps.includes('php'), 'filters out php itself');
    assert.ok(r.deps.includes('framework'));
    assert.ok(r.deps.includes('phpunit'));
  });
});

describe('parseMixExs', () => {
  test('extracts atom dep names', async () => {
    const p = await fixture('mix.exs', `defmodule MyApp.MixProject do\n  defp deps do\n    [\n      {:phoenix, "~> 1.7"},\n      {:ecto_sql, "~> 3.10"},\n      {:postgrex, ">= 0.0.0"}\n    ]\n  end\nend\n`);
    const r = await parseMixExs(p);
    assert.ok(r.deps.includes('phoenix'));
    assert.ok(r.deps.includes('ecto_sql'));
    assert.ok(r.deps.includes('postgrex'));
  });
});

// ── cavemanCompress ───────────────────────────────────────────────────────────

describe('cavemanCompress', () => {
  test('strips blockquote lines entirely', () => {
    const r = cavemanCompress('> This is an epigraph\n\nReal content here.');
    assert.ok(!r.includes('>'), 'no > in output');
    assert.ok(!r.includes('epigraph'), 'blockquote text removed');
    assert.ok(r.includes('Real content'), 'real content preserved');
  });

  test('strips horizontal rules', () => {
    const r = cavemanCompress('Before\n\n---\n\nAfter');
    assert.ok(!r.includes('---'), 'horizontal rule removed');
    assert.ok(r.includes('Before') && r.includes('After'));
  });

  test('preserves fenced code blocks', () => {
    const r = cavemanCompress('Run this:\n\n```bash\nnpm install\n```\n');
    assert.ok(r.includes('```bash'), 'code block preserved');
    assert.ok(r.includes('npm install'));
  });

  test('strips bold and italic markers', () => {
    const r = cavemanCompress('This is **bold** and *italic* text.');
    assert.ok(!r.includes('**'), 'no bold markers');
    assert.ok(r.includes('bold') && r.includes('italic'));
  });

  test('removes URLs', () => {
    const r = cavemanCompress('See https://example.com/docs for details.');
    assert.ok(!r.includes('http'), 'URL removed');
    assert.ok(r.includes('See') && r.includes('for details'));
  });

  test('strips filler words', () => {
    const r = cavemanCompress('This is basically just really quite useful.');
    assert.ok(!r.includes('basically') && !r.includes('just') && !r.includes('really') && !r.includes('quite'));
  });

  test('strips articles', () => {
    const r = cavemanCompress('This is a tool that does the thing.');
    assert.ok(!/ a tool/.test(r) || !/ the thing/.test(r));
  });

  test('strips inline markdown links, keeps text', () => {
    const r = cavemanCompress('See [the docs](https://example.com) for more.');
    assert.ok(!r.includes(']('), 'no link syntax');
    assert.ok(r.includes('docs'), 'link text preserved');
  });

  test('returns empty-ish string for whitespace-only input', () => {
    assert.equal(cavemanCompress('   \n\n  '), '');
  });
});

// ── globToRegex ───────────────────────────────────────────────────────────────

describe('globToRegex', () => {
  test('*.ts matches same-level ts file', () => {
    assert.ok(globToRegex('*.ts').test('foo.ts'));
  });

  test('*.ts does not match nested ts file', () => {
    assert.ok(!globToRegex('*.ts').test('src/foo.ts'));
  });

  test('**/*.ts matches nested ts file', () => {
    assert.ok(globToRegex('**/*.ts').test('src/foo.ts'));
    assert.ok(globToRegex('**/*.ts').test('a/b/c/foo.ts'));
  });

  test('node_modules matches exact dir name', () => {
    assert.ok(globToRegex('node_modules').test('node_modules'));
  });

  test('? matches single non-slash char', () => {
    assert.ok(globToRegex('fo?.ts').test('foo.ts'));
    assert.ok(!globToRegex('fo?.ts').test('fooo.ts'));
    assert.ok(!globToRegex('fo?.ts').test('fo/ts'));
  });

  test('dot in pattern is escaped (literal)', () => {
    assert.ok(globToRegex('*.test.ts').test('foo.test.ts'));
    assert.ok(!globToRegex('*.test.ts').test('footestXts'));
  });

  test('** alone matches anything', () => {
    assert.ok(globToRegex('**').test('anything/deep/path.ts'));
  });

  test('**/dist/** matches dist at any depth', () => {
    assert.ok(globToRegex('**/dist/**').test('packages/foo/dist/index.js'));
  });
});
