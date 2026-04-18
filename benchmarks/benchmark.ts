#!/usr/bin/env node
/**
 * CHODE Benchmark Runner
 * Sends a .chode profile + 30 standardized questions to an AI model.
 * Supports Ollama (local) and OpenRouter (API).
 *
 * Usage:
 *   node --experimental-strip-types benchmarks/benchmark.ts --model qwen2.5-coder:7b
 *   node --experimental-strip-types benchmarks/benchmark.ts --provider openrouter --model openai/gpt-4o --key sk-...
 *   node --experimental-strip-types benchmarks/benchmark.ts --provider openrouter --model google/gemini-pro-1.5
 *   (reads OPENROUTER_API_KEY env var if --key not provided)
 */

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OLLAMA_URL = 'http://localhost:1143';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Questions ─────────────────────────────────────────────────────────────────

type QuestionDef = { id: string; topic: string; category: string; stump?: boolean; text: string };

const QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    topic: 'Primary languages',           text: 'What language(s) is this project primarily written in?' },
  { id: 'Q2',  category: 'Objective',    topic: 'Web frameworks',              text: 'What web framework(s) does it use?' },
  { id: 'Q3',  category: 'Objective',    topic: 'Databases',                   text: 'What database(s) does it support or use?' },
  { id: 'Q4',  category: 'Objective',    topic: 'Package managers',            text: 'What package manager(s) are used?' },
  { id: 'Q5',  category: 'Objective',    topic: 'Primary purpose',             text: "What is the project's primary purpose in one sentence?" },
  { id: 'Q6',  category: 'Navigational', topic: 'Main entry point',            text: 'What is the main entry point file?' },
  { id: 'Q7',  category: 'Navigational', topic: 'Monorepo / top-level count',  text: 'Is this a monorepo? How many top-level packages?' },
  { id: 'Q8',  category: 'Navigational', topic: 'Routes/handlers location',    text: 'Where are HTTP routes/handlers defined?' },
  { id: 'Q9',  category: 'Navigational', topic: 'Schema/ORM models',           text: 'Where is the data schema or ORM models defined?' },
  { id: 'Q10', category: 'Navigational', topic: 'Frontend/UI code location',   text: 'Where does frontend/UI code live?' },
  { id: 'Q11', category: 'Inferential',  topic: 'Architectural pattern',       text: 'What architectural pattern does the project follow?' },
  { id: 'Q12', category: 'Inferential',  topic: 'Project type',                text: 'Frontend, backend, CLI, library, or fullstack?' },
  { id: 'Q13', category: 'Inferential',  topic: 'Configuration management',    text: 'How is configuration managed?' },
  { id: 'Q14', category: 'Inferential',  topic: 'Dependency injection',        text: 'Does the project use dependency injection?' },
  { id: 'Q15', category: 'Inferential',  topic: 'Authentication',              text: 'How is authentication handled?' },
  { id: 'Q16', category: 'Domain',       topic: 'Main domain entities',        text: 'What are the main domain entities?' },
  { id: 'Q17', category: 'Domain',       topic: 'External integrations',       text: 'What external services or APIs does it integrate with?' },
  { id: 'Q18', category: 'Domain',       topic: 'Test framework',              text: 'What test framework is used?' },
  { id: 'Q19', category: 'Domain',       topic: 'How to run tests',            text: 'How do you run the test suite?' },
  { id: 'Q20', category: 'Domain',       topic: 'CI system',                   text: 'What CI system is used?' },
  { id: 'Q21', category: 'Navigation',   topic: 'Where to add API endpoint',   text: 'Where would you add a new API endpoint?' },
  { id: 'Q22', category: 'Navigation',   topic: 'Migrations location',         text: 'Where would you find database migrations?' },
  { id: 'Q23', category: 'Navigation',   topic: 'Core business logic',         text: 'Where is the core business logic concentrated?' },
  { id: 'Q24', category: 'Navigation',   topic: 'Error handling middleware',   text: 'Where is error handling middleware?' },
  { id: 'Q25', category: 'Navigation',   topic: 'Env var documentation',       text: 'Where are environment variables documented?' },
  { id: 'Q26', category: 'Deep',         topic: 'Top 3 internal packages',     text: 'What are the top 3 most-used internal packages?' },
  { id: 'Q27', category: 'Deep',         topic: 'Bootstrap/init sequence',     text: 'What does the bootstrap/initialization sequence look like?' },
  { id: 'Q28', category: 'Deep',         topic: 'Notable design patterns',     text: 'What notable design patterns appear in the codebase?' },
  { id: 'Q29', category: 'Deep',         topic: 'Key deployer config options', text: 'What are the key config options a deployer would set?' },
  { id: 'Q30', category: 'Deep',         topic: 'New contributor essentials',  text: 'What would a new contributor need to know first?' },
];

// ── Per-repo question sets (profile-dependent, stack-idiomatic) ──────────────
// stump=true: a framework expert would likely answer wrong without reading the profile

const DJANGO_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'Language',               text: 'What language is this project primarily written in?' },
  { id: 'Q2',  category: 'Objective',    stump: true,  topic: 'Config format',          text: 'What configuration file format does this project use?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'Package managers',       text: 'What package managers does this project use? List all mentioned.' },
  { id: 'Q4',  category: 'Objective',    stump: true,  topic: 'JS test frameworks',     text: 'What JavaScript test frameworks are used in this project?' },
  { id: 'Q5',  category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured?' },
  { id: 'Q6',  category: 'Inferential',  stump: false, topic: 'Architectural pattern',  text: 'What architectural pattern does this codebase implement?' },
  { id: 'Q7',  category: 'Navigational', stump: true,  topic: 'Middleware file',        text: 'What is the specific middleware file path mentioned in the profile?' },
  { id: 'Q8',  category: 'Navigational', stump: true,  topic: 'Core package size',      text: 'How many source files are in the core django/ package?' },
  { id: 'Q9',  category: 'Navigational', stump: true,  topic: 'Largest directory',      text: 'Which top-level directory has the most files?' },
  { id: 'Q10', category: 'Inferential',  stump: false, topic: 'Project type',           text: 'Is this a framework, library, CLI tool, or application?' },
  { id: 'Q11', category: 'Objective',    stump: false, topic: 'Primary purpose',        text: "What is this project's primary purpose in one sentence?" },
  { id: 'Q12', category: 'Inferential',  stump: true,  topic: 'File skew',             text: 'How many times larger is the core django/ package than the js_tests/ package by file count?' },
];

const LARAVEL_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'Language',               text: 'What language is this project primarily written in?' },
  { id: 'Q2',  category: 'Objective',    stump: false, topic: 'Test framework',         text: 'What test framework is used?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'Package manager',        text: 'What package manager does this project use according to the profile?' },
  { id: 'Q4',  category: 'Navigational', stump: false, topic: 'Routes location',        text: 'Where are HTTP routes defined?' },
  { id: 'Q5',  category: 'Inferential',  stump: false, topic: 'Design pattern',         text: 'What design pattern does this codebase use?' },
  { id: 'Q6',  category: 'Domain',       stump: true,  topic: 'Session env vars',       text: 'What environment variables control session management in this project?' },
  { id: 'Q7',  category: 'Domain',       stump: true,  topic: 'DB connection env var',  text: 'What environment variable controls the database connection?' },
  { id: 'Q8',  category: 'Domain',       stump: true,  topic: 'Password hashing env',  text: 'What environment variable controls password hashing rounds?' },
  { id: 'Q9',  category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured?' },
  { id: 'Q10', category: 'Navigational', stump: true,  topic: 'App structure',          text: 'What are the three subdirectories inside the app/ directory?' },
  { id: 'Q11', category: 'Inferential',  stump: false, topic: 'Project type',           text: 'Is this a framework, library, application skeleton, or CLI tool?' },
  { id: 'Q12', category: 'Objective',    stump: false, topic: 'Primary purpose',        text: "What is this project's primary purpose in one sentence?" },
];

const PHOENIX_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'Language',               text: 'What language is this project primarily written in?' },
  { id: 'Q2',  category: 'Objective',    stump: false, topic: 'Database library',       text: 'What database library/ORM does this project use?' },
  { id: 'Q3',  category: 'Objective',    stump: false, topic: 'HTTP layer',             text: 'What HTTP middleware layer does this project use?' },
  { id: 'Q4',  category: 'Objective',    stump: true,  topic: 'Package managers',       text: 'What package managers does this project use? List all mentioned.' },
  { id: 'Q5',  category: 'Objective',    stump: true,  topic: 'Test frameworks',        text: 'What test frameworks or test commands does this project use?' },
  { id: 'Q6',  category: 'Objective',    stump: true,  topic: 'i18n library',           text: 'What internationalization library is used?' },
  { id: 'Q7',  category: 'Domain',       stump: true,  topic: 'Ecto association rule',  text: 'What is the convention for Ecto associations when they will be accessed in templates?' },
  { id: 'Q8',  category: 'Domain',       stump: true,  topic: 'Ecto field type rule',   text: 'What Ecto.Schema field type should be used for text database columns?' },
  { id: 'Q9',  category: 'Domain',       stump: true,  topic: 'Repo adapter',           text: 'What Ecto database adapter does the generated Repo module use?' },
  { id: 'Q10', category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured?' },
  { id: 'Q11', category: 'Navigational', stump: true,  topic: 'Largest directory',      text: 'Which top-level directory has the most files?' },
  { id: 'Q12', category: 'Inferential',  stump: false, topic: 'Project type',           text: 'Is this a framework, library, application, or CLI tool?' },
];

const RIPGREP_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'Language',               text: 'What language is this project written in?' },
  { id: 'Q2',  category: 'Objective',    stump: false, topic: 'Package manager',        text: 'What package manager is used?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'Error handling crate',   text: 'What error handling crate does this project use?' },
  { id: 'Q4',  category: 'Objective',    stump: true,  topic: 'Serialization crate',    text: 'What serialization crate is used?' },
  { id: 'Q5',  category: 'Navigational', stump: true,  topic: 'Entry point',            text: 'What is the main entry point file?' },
  { id: 'Q6',  category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured?' },
  { id: 'Q7',  category: 'Domain',       stump: true,  topic: 'Disable filtering flag', text: 'What flag disables ALL automatic filtering in ripgrep?' },
  { id: 'Q8',  category: 'Domain',       stump: true,  topic: 'Fuzz tool',             text: 'What fuzz testing tool does this project use, and how do you install it?' },
  { id: 'Q9',  category: 'Navigational', stump: false, topic: 'Largest workspace',      text: 'Which top-level workspace has the most files?' },
  { id: 'Q10', category: 'Navigational', stump: true,  topic: 'Platform packages',     text: 'What platform-specific distribution packages exist in this project?' },
  { id: 'Q11', category: 'Inferential',  stump: false, topic: 'Project type',           text: 'Is this a CLI tool, library, framework, or application?' },
  { id: 'Q12', category: 'Objective',    stump: false, topic: 'Primary purpose',        text: "What is this tool's primary purpose in one sentence?" },
];

const GHCLI_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'Language',               text: 'What language is this project written in?' },
  { id: 'Q2',  category: 'Objective',    stump: true,  topic: 'CLI framework',          text: 'What CLI framework/library does this project use?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'gRPC usage',             text: 'Does this project use gRPC? What evidence is in the profile?' },
  { id: 'Q4',  category: 'Objective',    stump: false, topic: 'Test command',           text: 'What is the command to run tests?' },
  { id: 'Q5',  category: 'Navigational', stump: true,  topic: 'Entry point',            text: 'What is the main entry point file according to the profile?' },
  { id: 'Q6',  category: 'Navigational', stump: true,  topic: 'Largest package',        text: 'Which package has the most files, and how many?' },
  { id: 'Q7',  category: 'Domain',       stump: true,  topic: 'Comment convention',     text: 'What comment style is required for exported functions, types, and constants?' },
  { id: 'Q8',  category: 'Domain',       stump: true,  topic: 'Banned punctuation',     text: 'What punctuation character is banned from code, comments, and documentation?' },
  { id: 'Q9',  category: 'Domain',       stump: true,  topic: 'Acceptance test type',   text: 'What type of tests are the acceptance tests described as?' },
  { id: 'Q10', category: 'Domain',       stump: true,  topic: 'Test framework',         text: 'What framework powers the acceptance tests?' },
  { id: 'Q11', category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured?' },
  { id: 'Q12', category: 'Objective',    stump: false, topic: 'Primary purpose',        text: "What is this tool's primary purpose in one sentence?" },
];

const FASTAPI_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: true,  topic: 'Package manager',        text: 'What package manager is used for Python dependencies in this project?' },
  { id: 'Q2',  category: 'Objective',    stump: false, topic: 'ASGI base framework',    text: 'What ASGI framework does this library build on top of?' },
  { id: 'Q3',  category: 'Objective',    stump: false, topic: 'Validation library',     text: 'What data validation library provides the type system?' },
  { id: 'Q4',  category: 'Navigational', stump: true,  topic: 'Application class file', text: 'What file defines the main FastAPI application class?' },
  { id: 'Q5',  category: 'Navigational', stump: true,  topic: 'Routing file',           text: 'What file contains the HTTP routing logic?' },
  { id: 'Q6',  category: 'Objective',    stump: true,  topic: 'Config format',          text: 'What file format is used for project configuration (pyproject, setup.cfg, requirements.txt, or toml)?' },
  { id: 'Q7',  category: 'Inferential',  stump: true,  topic: 'Architectural patterns', text: 'What architectural patterns does this codebase implement?' },
  { id: 'Q8',  category: 'Objective',    stump: false, topic: 'CI system',              text: 'What CI system is configured for this project?' },
  { id: 'Q9',  category: 'Domain',       stump: true,  topic: 'Install command',        text: 'What is the exact command to install FastAPI with all standard dependencies?' },
  { id: 'Q10', category: 'Inferential',  stump: true,  topic: 'File distribution',      text: 'Does the core library or the documentation examples directory contain more files? Give the counts.' },
  { id: 'Q11', category: 'Inferential',  stump: false, topic: 'Project type',           text: 'Is this a framework, library, CLI tool, or application?' },
  { id: 'Q12', category: 'Objective',    stump: false, topic: 'Primary purpose',        text: "What is this project's primary purpose in one sentence?" },
];

const RAILS_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: true,  topic: 'Background job lib',     text: 'What background job processing library does this project use?' },
  { id: 'Q2',  category: 'Objective',    stump: true,  topic: 'JS bundler',             text: 'What JavaScript bundler handles frontend assets in this project?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'JS test framework',      text: 'What JavaScript test framework(s) are used in this project?' },
  { id: 'Q4',  category: 'Navigational', stump: true,  topic: 'Largest component',      text: 'Which component in this monorepo has the most Ruby source files? Give the count.' },
  { id: 'Q5',  category: 'Objective',    stump: false, topic: 'Web server',             text: 'What web server does this project use?' },
  { id: 'Q6',  category: 'Objective',    stump: false, topic: 'In-memory store',        text: 'What in-memory data store is part of the stack?' },
  { id: 'Q7',  category: 'Domain',       stump: true,  topic: 'Run component tests',    text: 'What is the command to run tests for a specific component, for example ActionView?' },
  { id: 'Q8',  category: 'Domain',       stump: true,  topic: 'Test config utility',    text: 'What Active Support utility should you use to temporarily modify class attributes in tests instead of manual set/restore?' },
  { id: 'Q9',  category: 'Objective',    stump: false, topic: 'Ruby pkg manager',       text: 'What package manager handles Ruby gem dependencies?' },
  { id: 'Q10', category: 'Objective',    stump: false, topic: 'JS pkg manager',         text: 'What package manager handles JavaScript dependencies?' },
  { id: 'Q11', category: 'Objective',    stump: true,  topic: 'Password hashing lib',   text: 'What password hashing library is included in the stack?' },
  { id: 'Q12', category: 'Inferential',  stump: true,  topic: 'Monorepo scale',         text: 'How many independent components does this monorepo contain?' },
];

const NEXTJS_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: false, topic: 'JS pkg manager',         text: 'What JavaScript package manager does this monorepo use?' },
  { id: 'Q2',  category: 'Objective',    stump: true,  topic: 'Native bindings lang',   text: 'What programming language are the native SWC bindings written in?' },
  { id: 'Q3',  category: 'Objective',    stump: true,  topic: 'Native pkg manager',     text: 'What package manager handles the native language dependencies?' },
  { id: 'Q4',  category: 'Objective',    stump: false, topic: 'Test frameworks',        text: 'What test frameworks are used in this project?' },
  { id: 'Q5',  category: 'Domain',       stump: true,  topic: 'External API',           text: 'What external service API does this project integrate with?' },
  { id: 'Q6',  category: 'Navigational', stump: true,  topic: 'Routing entry point',    text: 'What is the entry point file for the routing package?' },
  { id: 'Q7',  category: 'Navigational', stump: true,  topic: 'Middleware location',    text: 'Where is middleware located in this project?' },
  { id: 'Q8',  category: 'Inferential',  stump: true,  topic: 'Design patterns',        text: 'What design patterns does this codebase implement?' },
  { id: 'Q9',  category: 'Inferential',  stump: true,  topic: 'Largest directory',      text: 'Which top-level directory contains the most files?' },
  { id: 'Q10', category: 'Domain',       stump: true,  topic: 'Auth env vars',          text: 'What environment variables are used for authentication in this project?' },
  { id: 'Q11', category: 'Objective',    stump: false, topic: 'CSS framework',          text: 'What CSS framework is part of the technology stack?' },
  { id: 'Q12', category: 'Inferential',  stump: true,  topic: 'Second largest package', text: 'What is the second-largest top-level package by file count?' },
];

const GITEA_QUESTIONS: QuestionDef[] = [
  { id: 'Q1',  category: 'Objective',    stump: true,  topic: 'All package managers',   text: 'What package managers does this project use? List all of them.' },
  { id: 'Q2',  category: 'Objective',    stump: true,  topic: 'Go HTTP router',         text: 'What Go HTTP router library is used?' },
  { id: 'Q3',  category: 'Objective',    stump: false, topic: 'Frontend framework',     text: 'What frontend framework and bundler are used?' },
  { id: 'Q4',  category: 'Objective',    stump: true,  topic: 'Config format',          text: 'What configuration file format does this project use?' },
  { id: 'Q5',  category: 'Navigational', stump: false, topic: 'Entry point',            text: 'What is the main application entry point file?' },
  { id: 'Q6',  category: 'Navigational', stump: false, topic: 'Routes location',        text: 'Where are HTTP routes defined?' },
  { id: 'Q7',  category: 'Navigational', stump: true,  topic: 'Middleware location',    text: 'Where is common/error-handling middleware located?' },
  { id: 'Q8',  category: 'Navigational', stump: true,  topic: 'Migration count',        text: 'How many database migration files does this project have?' },
  { id: 'Q9',  category: 'Inferential',  stump: true,  topic: 'Auth methods',           text: 'What authentication methods does this project support? List as many as the profile mentions.' },
  { id: 'Q10', category: 'Inferential',  stump: true,  topic: 'Architectural layers',   text: 'What is the architectural layer order from entry point to data layer?' },
  { id: 'Q11', category: 'Domain',       stump: true,  topic: 'External integrations',  text: 'What cloud storage providers and monitoring systems does it integrate with?' },
  { id: 'Q12', category: 'Domain',       stump: true,  topic: 'Pre-commit requirement', text: 'What command must you run before committing code?' },
];

const REPO_QUESTIONS: Record<string, QuestionDef[]> = {
  gitea:   GITEA_QUESTIONS,
  fastapi: FASTAPI_QUESTIONS,
  rails:   RAILS_QUESTIONS,
  nextjs:  NEXTJS_QUESTIONS,
  django:  DJANGO_QUESTIONS,
  laravel: LARAVEL_QUESTIONS,
  phoenix: PHOENIX_QUESTIONS,
  ripgrep: RIPGREP_QUESTIONS,
  'gh-cli': GHCLI_QUESTIONS,
};

// ── Per-repo ground truth (for repo-specific question sets) ───────────────────

const FASTAPI_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['uv'],                        good: [],                    note: 'stump: experts default to pip/poetry' },
  Q2:  { must: ['starlette'],                 good: [] },
  Q3:  { must: ['pydantic'],                  good: [] },
  Q4:  { must: ['applications.py'],           good: [] },
  Q5:  { must: ['routing.py'],                good: [] },
  Q6:  { must: ['toml'],                      good: [],                    note: 'stump: experts say setup.cfg or requirements.txt' },
  Q7:  { must: ['middleware'],                good: ['event'],             note: 'event-driven + middleware-chain from @PATTERNS' },
  Q8:  { must: ['github'],                    good: ['actions'] },
  Q9:  { must: ['standard'],                  good: ['fastapi'],           note: '"fastapi[standard]" — stump: most say pip install fastapi' },
  Q10: { must: ['docs'],                      good: ['457', '53'],         note: 'docs_src 457 > fastapi 53 — stump: expect core > docs' },
  Q11: { must: ['library'],                   good: ['framework'] },
  Q12: { must: ['api', 'python'],             good: ['fast', 'type'] },
};

const RAILS_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['resque'],                    good: [],                    note: 'stump: experts default to sidekiq' },
  Q2:  { must: ['rollup'],                    good: [],                    note: 'stump: experts say webpacker/esbuild' },
  Q3:  { must: ['karma'],                     good: ['qunit'],             note: 'stump: experts say jest/mocha' },
  Q4:  { must: ['activerecord'],              good: ['1143'],              note: 'activerecord has 1143 files — stump: navigational' },
  Q5:  { must: ['puma'],                      good: [] },
  Q6:  { must: ['redis'],                     good: [] },
  Q7:  { must: ['bin/test'],                  good: ['cd'],                note: 'exact command from @TESTING' },
  Q8:  { must: ['with'],                      good: ['object'],            note: 'Object#with from @ENV — very specific stump' },
  Q9:  { must: ['bundler'],                   good: [] },
  Q10: { must: ['yarn'],                      good: [] },
  Q11: { must: ['bcrypt'],                    good: [],                    note: 'stump: experts say has_secure_password' },
  Q12: { must: ['10'],                        good: [],                    note: '10+ components from @PURPOSE' },
};

const NEXTJS_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['pnpm'],                      good: [] },
  Q2:  { must: ['rust'],                      good: [],                    note: 'stump: experts might say C/C++' },
  Q3:  { must: ['cargo'],                     good: [],                    note: 'stump: Rust package manager' },
  Q4:  { must: ['playwright', 'vitest'],      good: [] },
  Q5:  { must: ['slack'],                     good: [],                    note: 'very specific stump — from @API' },
  Q6:  { must: ['next-routing'],              good: ['packages/'] },
  Q7:  { must: ['next-routing'],              good: ['packages/'] },
  Q8:  { must: ['repository', 'factory', 'plugin'], good: [] },
  Q9:  { must: ['examples'],                  good: ['4'],                 note: 'examples/(4.1k) largest — stump: experts expect packages/' },
  Q10: { must: ['auth'],                      good: ['github'],            note: 'AUTH_GITHUB_ID etc from @ENV' },
  Q11: { must: ['tailwind'],                  good: [] },
  Q12: { must: ['turbopack'],                 good: ['2800'],              note: 'turbopack/(2800) from @PACKAGES' },
};

const GITEA_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['pnpm', 'gomod'],             good: ['uv'],              note: 'stump: uv is the third one experts miss' },
  Q2:  { must: ['chi'],                        good: [],                  note: 'stump: experts guess gin/echo/mux' },
  Q3:  { must: ['vue'],                        good: ['esbuild', 'vite'], note: 'stump: experts might say react' },
  Q4:  { must: ['ini'],                        good: [],                  note: 'stump: Go devs expect YAML/TOML' },
  Q5:  { must: ['main.go'],                    good: [] },
  Q6:  { must: ['routers'],                    good: [] },
  Q7:  { must: ['common'],                     good: ['routers/common'],  note: 'from @MIDDLEWARE' },
  Q8:  { must: ['305'],                        good: [],                  note: 'exact count from @DATA — very specific stump' },
  Q9:  { must: ['ldap', 'oauth', 'webauthn'],  good: ['pam', 'openid', 'smtp', 'password'], note: 'stump: many auth methods, experts list 2-3' },
  Q10: { must: ['cmd', 'routes', 'svc', 'mdl'], good: [],                note: 'from @ARCH layered(cmd→routes→svc→mdl)' },
  Q11: { must: ['azure', 'aws', 'minio'],      good: ['prometheus'],      note: 'from @API — stump: experts say S3 not minio' },
  Q12: { must: ['make fmt'],                   good: [],                  note: 'from @CONVENTIONS — very specific stump' },
};

const DJANGO_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['python'],                    good: [] },
  Q2:  { must: ['ini'],                        good: [],                    note: 'stump: devs expect Python settings.py, not ini' },
  Q3:  { must: ['pip'],                        good: ['npm'],               note: 'stump: experts say pip only, miss npm' },
  Q4:  { must: ['puppeteer'],                  good: ['qunit'],             note: 'stump: unexpected JS test tools in a Python project' },
  Q5:  { must: ['github'],                     good: ['actions'] },
  Q6:  { must: ['middleware'],                 good: [] },
  Q7:  { must: ['admindocs', 'middleware'],    good: ['django/contrib'],    note: 'exact path from @MIDDLEWARE — very specific stump' },
  Q8:  { must: ['923'],                        good: [],                    note: 'exact count from @PACKAGES' },
  Q9:  { must: ['django'],                     good: ['3.6', '3600'] },
  Q10: { must: ['framework'],                  good: [] },
  Q11: { must: ['python', 'web'],              good: ['rapid', 'pragmatic'] },
  Q12: { must: ['80', '83', '923'],            good: [],                    note: '923/11 ≈ 83x — stump: vast asymmetry' },
};

const LARAVEL_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['php'],                        good: [] },
  Q2:  { must: ['phpunit'],                    good: [] },
  Q3:  { must: ['npm'],                        good: [],                    note: 'stump: experts say composer — but composer.lock not committed so CHODE only sees npm' },
  Q4:  { must: ['routes'],                     good: [] },
  Q5:  { must: ['factory'],                    good: [] },
  Q6:  { must: ['session_driver', 'session'],  good: ['lifetime', 'encrypt'], note: 'SESSION_* env vars from @ENV' },
  Q7:  { must: ['db_connection'],              good: [],                    note: 'exact env var from @ENV' },
  Q8:  { must: ['bcrypt'],                     good: ['rounds'],            note: 'BCRYPT_ROUNDS from @ENV — very specific stump' },
  Q9:  { must: ['github'],                     good: ['actions'] },
  Q10: { must: ['http', 'models', 'providers'], good: [],                  note: 'app/{Http,Models,Providers} from @STRUCT' },
  Q11: { must: ['framework', 'skeleton'],      good: [] },
  Q12: { must: ['php', 'web'],                 good: ['elegant', 'expressive'] },
};

const PHOENIX_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['elixir'],                     good: [] },
  Q2:  { must: ['ecto'],                       good: [] },
  Q3:  { must: ['plug'],                       good: [] },
  Q4:  { must: ['mix'],                        good: ['npm'],               note: 'stump: experts say mix only, miss npm' },
  Q5:  { must: ['mix test'],                   good: ['jest'],              note: 'stump: experts say ExUnit only, miss jest' },
  Q6:  { must: ['gettext'],                    good: [],                    note: 'stump: experts might say linguist or i18n' },
  Q7:  { must: ['preload'],                    good: [],                    note: 'always preload Ecto associations — from @CONVENTIONS' },
  Q8:  { must: ['string'],                     good: [],                    note: ':string not :text — specific convention from @CONVENTIONS' },
  Q9:  { must: ['postgres'],                   good: ['ecto.adapters'],     note: 'Ecto.Adapters.Postgres from @ENV' },
  Q10: { must: ['github'],                     good: ['actions'] },
  Q11: { must: ['installer'],                  good: ['106'],               note: 'installer/(106) largest — stump: experts expect lib/' },
  Q12: { must: ['framework'],                  good: ['elixir'] },
};

const RIPGREP_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['rust'],                       good: [] },
  Q2:  { must: ['cargo'],                      good: [] },
  Q3:  { must: ['anyhow'],                     good: [],                    note: 'stump: experts guess thiserror or std::error' },
  Q4:  { must: ['serde'],                      good: ['serde_json', 'json'] },
  Q5:  { must: ['main.rs'],                    good: ['crates/core'],       note: 'stump: experts say src/main.rs' },
  Q6:  { must: ['github'],                     good: ['actions'] },
  Q7:  { must: ['-uuu'],                       good: [],                    note: 'exact flag from @PURPOSE — very specific stump' },
  Q8:  { must: ['cargo-fuzz', 'cargo install'], good: [],                  note: 'from @SETUP — specific install command' },
  Q9:  { must: ['crates'],                     good: ['136'] },
  Q10: { must: ['windows'],                    good: ['brew'],              note: 'pkg/{windows,brew} from @STRUCT' },
  Q11: { must: ['cli'],                        good: ['tool'] },
  Q12: { must: ['search', 'regex'],            good: ['recursive', 'gitignore'] },
};

const GHCLI_Q_GT: Record<string, GroundTruth> = {
  Q1:  { must: ['go'],                         good: [] },
  Q2:  { must: ['cobra'],                      good: [],                    note: 'stump: experts guess flag, urfave/cli, or kingpin' },
  Q3:  { must: ['yes', 'grpc'],                good: [],                    note: 'grpc in @STACK — stump: unexpected in a CLI tool' },
  Q4:  { must: ['make test'],                  good: [] },
  Q5:  { must: ['gen-docs', 'main.go'],        good: ['cmd/'],              note: 'stump: cmd/gen-docs/main.go not the main gh entry' },
  Q6:  { must: ['pkg', '688'],                 good: [],                    note: 'pkg/(688) from @PACKAGES' },
  Q7:  { must: ['godoc'],                      good: [],                    note: 'godoc comments required — from @CONVENTIONS' },
  Q8:  { must: ['em dash'],                    good: ['—'],                 note: 'em dashes banned — very specific stump from @CONVENTIONS' },
  Q9:  { must: ['blackbox'],                   good: [],                    note: 'from @TESTING' },
  Q10: { must: ['testscript'],                 good: ['go-internal'],       note: 'go-internal/testscript from @TESTING — specific stump' },
  Q11: { must: ['github'],                     good: ['actions'] },
  Q12: { must: ['github', 'cli'],              good: ['pull request', 'terminal'] },
};

const REPO_GT: Record<string, Record<string, GroundTruth>> = {
  gitea:   GITEA_Q_GT,
  fastapi: FASTAPI_Q_GT,
  rails:   RAILS_Q_GT,
  nextjs:  NEXTJS_Q_GT,
  django:  DJANGO_Q_GT,
  laravel: LARAVEL_Q_GT,
  phoenix: PHOENIX_Q_GT,
  ripgrep: RIPGREP_Q_GT,
  'gh-cli': GHCLI_Q_GT,
};

// ── Ground truth for auto-scoring (Gitea) ────────────────────────────────────
// must: all terms required for score >= 1
// good: additional terms needed for score 3
// When null: flag for manual scoring

type GroundTruth = {
  must: string[];
  good: string[];
  note?: string;
};

const GITEA_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['go'],          good: ['typescript', 'ts', 'vue'],                note: '3=go+ts/vue, 2=go only' },
  Q2:  { must: ['chi'],         good: ['vue', 'vite'],                            note: '3=chi+vue, 2=chi only' },
  Q3:  { must: ['mysql', 'sqlite'], good: ['mssql', 'redis', 'postgres', 'pq'],  note: '3=4+, 2=3 main ones' },
  Q4:  { must: ['pnpm', 'gomod'], good: ['uv'],                                  note: '3=all 3, 2=pnpm+gomod' },
  Q5:  { must: ['git', 'self-host'], good: ['easy', 'fast', 'gogs'],             note: 'purpose statement' },
  Q6:  { must: ['main.go'],     good: [],                                         note: 'binary correct/wrong' },
  Q7:  { must: [],              good: [],                                         note: 'manual: not a monorepo, single app' },
  Q8:  { must: ['routers'],     good: ['api/v1', 'ro/'],                         note: '@ROUTES routers/ is explicit now' },
  Q9:  { must: ['models'],        good: ['mdl/', 'migrations'],                  note: 'models (substring) matches mdl/ and models/; mdl+migrations for full credit' },
  Q10: { must: ['web_src'],     good: ['vue', 'ts'],                             note: 'web_src/ is explicit' },
  Q11: { must: ['layered'],     good: ['cmd', 'routes', 'svc', 'mdl'],           note: '@ARCH now explicit: layered(cmd→routes→svc→mdl)' },
  Q12: { must: ['fullstack'],   good: ['cli'],                                   note: 'fullstack+cli is full credit' },
  Q13: { must: ['ini'],         good: [],                                         note: 'binary: ini config' },
  Q14: { must: ['no', 'not'],   good: [],                                         note: 'correct answer is no DI' },
  Q15: { must: ['ldap', 'oauth', 'webauthn'], good: ['pam', 'openid', 'jwt', 'password'], note: 'multiple auth methods' },
  Q16: { must: ['actions', 'issues', 'organization'], good: ['auth', 'packages', 'git', 'perm'], note: 'from @ENTITIES' },
  Q17: { must: ['azure', 'aws', 'github'], good: ['minio', 'prometheus'],       note: 'from @API' },
  Q18: { must: ['playwright', 'vitest'], good: ['make test'],                   note: 'frontend test frameworks' },
  Q19: { must: ['make test'],   good: ['test-backend', 'test-frontend'],         note: 'make targets' },
  Q20: { must: ['github'],      good: ['actions', 'github-actions'],             note: 'github actions' },
  Q21: { must: ['routers'],     good: ['api/v1', 'api', 'ro/'],                 note: '@ROUTES routers/ surfaced explicitly' },
  Q22: { must: ['models/migrations', 'migration'], good: ['305'],               note: 'exact path in @DATA' },
  Q23: { must: ['svc'],         good: ['services', 'mod/'],                     note: 'svc substring matches svc/ and services both; v2 shows services/' },
  Q24: { must: ['routers/common', 'common/'],  good: [],                        note: '@MIDDLEWARE routers/common/ is now explicit' },
  Q25: { must: ['not'],         good: [],                                         note: '"not in profile" is correct' },
  Q26: { must: ['modules', 'models', 'services'], good: ['routers', 'cmd'],      note: '@PACKAGES now explicit: modules/models/services by file count' },
  Q27: { must: ['main.go', 'cmd/'], good: ['install', 'ro/install'],            note: 'entry + cmd + install' },
  Q28: { must: ['layered', 'strategy'], good: ['repository', 'middleware'],      note: '@ARCH+@PATTERNS: layered+strategy(auth)+repository+middleware-chain' },
  Q29: { must: [],              good: ['database', 'ini'],                       note: 'manual: DB config, INI keys' },
  Q30: { must: ['make fmt'],    good: ['test', 'styleguide', 'contributing'],   note: 'conventions from @CONTEXT' },
};

// ── Ground truth: FastAPI ─────────────────────────────────────────────────────
// Profile: ~211 tokens | library/framework repo | many Q = not in profile
const FASTAPI_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['python'],                  good: ['starlette', 'type'],         note: 'python primary; starlette underlying' },
  Q2:  { must: ['starlette'],               good: ['fastapi', 'pydantic'],       note: 'starlette is in @STACK; fastapi is what is being built' },
  Q3:  { must: [],                          good: [],                             note: 'manual: not in profile (library, no DB)' },
  Q4:  { must: ['uv'],                      good: [] },
  Q5:  { must: ['api', 'python'],           good: ['fast', 'performance', 'type'] },
  Q6:  { must: ['applications.py'],         good: [] },
  Q7:  { must: ['not'],                     good: [],                             note: 'not a monorepo — single package' },
  Q8:  { must: ['routing.py'],              good: ['fastapi/'] },
  Q9:  { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q10: { must: ['not'],                     good: [],                             note: 'no frontend in this library' },
  Q11: { must: ['middleware'],              good: ['event'] },
  Q12: { must: ['library'],                 good: ['framework'] },
  Q13: { must: ['toml'],                    good: [] },
  Q14: { must: [],                          good: [],                             note: 'manual: not explicit in profile (FastAPI has Depends() DI)' },
  Q15: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q16: { must: [],                          good: [],                             note: 'manual: not in profile (no domain entities in a library)' },
  Q17: { must: ['not'],                     good: [],                             note: 'not in profile' },
  Q18: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q19: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['routing.py'],              good: ['fastapi/'] },
  Q22: { must: ['not'],                     good: [],                             note: 'not in profile (library)' },
  Q23: { must: ['fastapi'],                 good: [] },
  Q24: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q25: { must: ['not'],                     good: [],                             note: 'not in profile' },
  Q26: { must: ['fastapi'],                 good: ['docs_src'] },
  Q27: { must: ['applications.py'],         good: [] },
  Q28: { must: ['middleware'],              good: ['event'] },
  Q29: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q30: { must: [],                          good: [],                             note: 'manual: not in profile' },
};

// ── Ground truth: Rails ───────────────────────────────────────────────────────
// Profile: ~494 tokens | monorepo (multiple gems) | Ruby web framework
const RAILS_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['ruby'],                    good: ['javascript', 'js'],          note: 'ruby primary; js frontend' },
  Q2:  { must: ['rails'],                   good: ['actionpack', 'rack'],        note: 'rails IS the framework being built' },
  Q3:  { must: [],                          good: [],                             note: 'manual: not in profile (activerecord supports many via adapters)' },
  Q4:  { must: ['bundler'],                 good: ['yarn'] },
  Q5:  { must: ['ruby'],                    good: ['web', 'framework', 'mvc', 'full'] },
  Q6:  { must: [],                          good: ['railties'],                   note: 'manual: no single entry (monorepo framework)' },
  Q7:  { must: ['monorepo'],                good: ['activerecord', 'actionpack', 'gems'], note: 'IS a monorepo with multiple gems' },
  Q8:  { must: ['actionpack'],              good: [] },
  Q9:  { must: ['activerecord'],            good: ['migration'] },
  Q10: { must: ['actionview'],              good: ['js'] },
  Q11: { must: [],                          good: ['mvc', 'modular'],             note: 'manual: MVC framework — not explicit in profile' },
  Q12: { must: ['framework'],               good: ['library', 'fullstack'] },
  Q13: { must: [],                          good: [],                             note: 'manual: not in profile (app config is user concern)' },
  Q14: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q15: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q16: { must: ['activerecord', 'actionpack', 'activesupport'], good: ['actionview', 'railties', 'activejob'] },
  Q17: { must: ['redis'],                   good: ['puma', 'resque'] },
  Q18: { must: ['minitest'],                good: ['karma', 'qunit'] },
  Q19: { must: ['bin/test'],                good: ['cd'] },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['actionpack'],              good: [] },
  Q22: { must: ['activerecord'],            good: ['migration'] },
  Q23: { must: ['activerecord', 'activesupport'], good: ['actionpack'] },
  Q24: { must: ['actionpack'],              good: ['middleware', 'rack'] },
  Q25: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q26: { must: ['activerecord', 'activesupport', 'actionpack'], good: ['railties', 'actionview'] },
  Q27: { must: ['railties'],                good: [] },
  Q28: { must: [],                          good: ['mvc', 'middleware', 'activerecord'], note: 'manual: MVC, active record pattern' },
  Q29: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q30: { must: ['bin/test'],                good: ['cd', 'component'] },
};

// ── Ground truth: Next.js ─────────────────────────────────────────────────────
// Profile: ~512 tokens | monorepo (packages/turbopack/crates/examples) | React framework
const NEXTJS_GROUND_TRUTH: Record<string, GroundTruth | null> = {
  Q1:  { must: ['typescript'],              good: ['javascript', 'rust'],        note: 'ts dominant; rust in turbopack crates' },
  Q2:  { must: ['react'],                   good: ['next', 'tailwind', 'zod'],   note: 'react + next in @STACK' },
  Q3:  { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q4:  { must: ['pnpm'],                    good: ['cargo'] },
  Q5:  { must: [],                          good: [],                             note: 'manual: @PURPOSE captured CLAUDE.md agent instructions, not actual purpose' },
  Q6:  { must: ['next-routing'],            good: ['packages/'] },
  Q7:  { must: ['monorepo'],                good: ['packages', 'turbopack', 'crates'], note: 'IS a monorepo' },
  Q8:  { must: ['next-routing'],            good: ['packages/'] },
  Q9:  { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q10: { must: ['packages'],                good: ['react', 'next'] },
  Q11: { must: [],                          good: ['plugin', 'modular'],          note: 'manual: complex monorepo architecture' },
  Q12: { must: ['framework'],               good: ['library'] },
  Q13: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q14: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q15: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q16: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q17: { must: ['slack'],                   good: [] },
  Q18: { must: ['playwright', 'vitest'],    good: [] },
  Q19: { must: ['test-dev-turbo'],          good: ['pnpm'] },
  Q20: { must: ['github'],                  good: ['actions'] },
  Q21: { must: ['next-routing'],            good: ['packages/'] },
  Q22: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q23: { must: ['packages', 'turbopack'],   good: [] },
  Q24: { must: ['next-routing'],            good: [] },
  Q25: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q26: { must: ['packages', 'turbopack', 'crates'], good: [] },
  Q27: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q28: { must: ['repository', 'factory', 'plugin'], good: [] },
  Q29: { must: [],                          good: [],                             note: 'manual: not in profile' },
  Q30: { must: [],                          good: ['contributing'],               note: 'manual: contributing/ dir exists but no specific instructions in profile' },
};

const GROUND_TRUTH_MAP: Record<string, Record<string, GroundTruth | null>> = {
  gitea:   GITEA_GROUND_TRUTH,
  fastapi: FASTAPI_GROUND_TRUTH,
  rails:   RAILS_GROUND_TRUTH,
  nextjs:  NEXTJS_GROUND_TRUTH,
};

// ── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(chodeContent: string, questions: QuestionDef[], baseline = false): string {
  const n = questions.length;
  const last = questions[n - 1]?.id ?? `Q${n}`;
  const questionList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  if (baseline) {
    return `You are participating in a controlled benchmark about a software repository. Answer the following ${n} questions using only your training knowledge. If you are not confident, make your best guess — do not refuse to answer.

Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE ${n} QUESTIONS:
${questionList}

Now answer Q1 through ${last} using the format shown above.`;
  }

  return `You are participating in a controlled benchmark. You will be given a .chode profile — a compressed description of a software repository — and must answer ${n} questions using ONLY the information in the profile.

RULES:
1. Use ONLY what is written in the .chode profile. Do not use prior knowledge about this repository or its ecosystem.
2. If the information is not in the profile, answer: "Not in profile."
3. Answer all ${n} questions in order.
4. Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line. Do not repeat the question text.

Example format:
Q1:
Go and TypeScript.

Q2:
Chi (backend), Vue 3 (frontend).

THE .CHODE PROFILE:
${chodeContent}

THE ${n} QUESTIONS:
${questionList}

Now answer Q1 through ${last} using the format shown above.`;
}

// ── API backends ──────────────────────────────────────────────────────────────

async function queryOllama(model: string, prompt: string): Promise<QueryResult> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: { temperature: 0, num_ctx: 16384 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  const data = await res.json() as {
    message?: { content: string };
    error?: string;
    prompt_eval_count?: number;
    eval_count?: number;
  };
  if (data.error) throw new Error(`Ollama: ${data.error}`);
  if (!data.message?.content) throw new Error('Ollama returned empty response');
  return {
    content: data.message.content,
    promptTokens: data.prompt_eval_count ?? 0,
    completionTokens: data.eval_count ?? 0,
  };
}

type QueryResult = { content: string; promptTokens: number; completionTokens: number };

const INTER_REQUEST_DELAY_MS = 1500;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryOpenRouter(model: string, apiKey: string, prompt: string): Promise<QueryResult> {
  const MAX_RETRIES = 3;
  let lastError: Error = new Error('unreachable');

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const backoff = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      console.log(`  [retry ${attempt}/${MAX_RETRIES}] waiting ${backoff}ms…`);
      await sleep(backoff);
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/chode',
        'X-Title': 'CHODE Benchmark',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 2000;
      console.log(`  [rate limited] retry-after ${retryAfter ?? '?'}s, waiting ${wait}ms…`);
      lastError = new Error(`OpenRouter rate limited (429)`);
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      lastError = new Error(`OpenRouter error ${res.status}: ${body}`);
      if (res.status >= 500) continue; // retry server errors
      throw lastError;   // 4xx (except 429) are not retryable
    }

    const data = await res.json() as {
      choices?: Array<{ message: { content: string } }>;
      error?: { message: string };
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    if (data.error) throw new Error(`OpenRouter: ${data.error.message}`);
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenRouter returned empty response');

    await sleep(INTER_REQUEST_DELAY_MS);
    return {
      content,
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
    };
  }

  throw lastError;
}

// ── Parser ────────────────────────────────────────────────────────────────────

function parseAnswers(raw: string, questions: QuestionDef[]): { answers: Map<string, string>; missing: string[] } {
  const answers = new Map<string, string>();
  const qMap = new Map(questions.map(q => [parseInt(q.id.slice(1)), q.text]));
  const maxQ = Math.max(...questions.map(q => parseInt(q.id.slice(1))));

  // Split on Q-labels: "Q1:", "Q1.", "Q1 " at start of line
  const blocks = raw.split(/\n(?=Q(\d{1,2})[:.)\s])/);

  for (const block of blocks) {
    const labelMatch = block.match(/^Q(\d{1,2})[:.)\s]/);
    if (!labelMatch) continue;
    const num = parseInt(labelMatch[1]!);
    if (num < 1 || num > maxQ) continue;

    // Strip label prefix only — handles both "Q1:\nanswer" and "Q1: answer" formats
    let body = block
      .replace(/^Q\d{1,2}[:.)\s]+/, '')           // strip label+separator, keep rest of line
      .replace(/^[A-Z]\d{1,2}[:.]\s*/m, '')       // remove "A1:" prefix some models add
      .trim();

    // If body starts with the question text (model repeated it), strip it
    const qText = qMap.get(num) ?? '';
    if (qText && body.toLowerCase().startsWith(qText.slice(0, 20).toLowerCase())) {
      body = body.slice(qText.length).replace(/^\s*\n?/, '').trim();
    }

    if (body) answers.set(`Q${num}`, body);
  }

  const missing = questions.map(q => q.id).filter(id => !answers.has(id));
  return { answers, missing };
}

// ── Auto-scorer ───────────────────────────────────────────────────────────────

type ScoreResult = { score: number; auto: boolean; reason: string };

const NOT_FOUND_PHRASES = ['not in profile', 'not explicitly stated', 'not mentioned', 'not specified', 'cannot be determined', 'no information'];

function autoScore(qId: string, answer: string, gt: GroundTruth | null | undefined): ScoreResult {
  if (!gt) return { score: -1, auto: false, reason: 'manual' };
  // Both empty = explicitly marked for manual review
  if (gt.must.length === 0 && gt.good.length === 0) return { score: -1, auto: false, reason: 'manual' };

  const a = answer.toLowerCase();

  // Bug fix: "Not in profile" with no must terms vacuously passes the must check,
  // producing a false score of 2. Catch it early and score 0 — model abstained.
  if (gt.must.length === 0 && NOT_FOUND_PHRASES.some(p => a.includes(p))) {
    return { score: 0, auto: true, reason: 'not in profile (no required terms to verify)' };
  }

  const hasAllMust = gt.must.length === 0 || gt.must.every(t => a.includes(t.toLowerCase()));
  const hasAnyMust = gt.must.length === 0 || gt.must.some(t => a.includes(t.toLowerCase()));
  const goodCount = gt.good.filter(t => a.includes(t.toLowerCase())).length;

  if (!hasAnyMust) return { score: 0, auto: true, reason: `missing required: ${gt.must.join(', ')}` };
  if (!hasAllMust) return { score: 1, auto: true, reason: 'partial must-haves' };
  // good terms = depth proof: any one present = full credit; none = score 2 (all must, no depth)
  if (gt.good.length > 0 && goodCount === 0) return { score: 2, auto: true, reason: `has must, missing: ${gt.good.join(', ')}` };
  return { score: 3, auto: true, reason: goodCount > 0 ? `has must + good (${goodCount}/${gt.good.length})` : 'all must present' };
}

// ── Output builder ────────────────────────────────────────────────────────────

function buildOutput(
  model: string,
  provider: string,
  chodeFile: string,
  chodeContent: string,
  raw: string,
  answers: Map<string, string>,
  missing: string[],
  scores: Map<string, ScoreResult>,
  repoName: string,
  questions: QuestionDef[],
  usage: { promptTokens: number; completionTokens: number },
  baseline: boolean,
): string {
  const date = new Date().toISOString().slice(0, 10);
  const tokenEst = Math.ceil(chodeContent.length / 4);

  const autoScored = [...scores.values()].filter(s => s.auto);
  const autoTotal = autoScored.reduce((n, s) => n + s.score, 0);
  const autoMax = autoScored.length * 3;
  const manualCount = [...scores.values()].filter(s => !s.auto).length;
  const stumpCount = questions.filter(q => q.stump).length;
  const stumpScored = questions.filter(q => q.stump).map(q => scores.get(q.id)).filter(s => s?.auto);
  const stumpTotal = stumpScored.reduce((n, s) => n + (s?.score ?? 0), 0);
  const stumpMax = stumpScored.length * 3;

  const rows = questions.map(q => {
    const answer = answers.get(q.id) ?? '_(not parsed)_';
    const short = answer.length > 250 ? answer.slice(0, 250).replace(/\s+\S*$/, '…') : answer;
    const escaped = short.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const scoreResult = scores.get(q.id);
    const scoreCell = scoreResult
      ? scoreResult.auto
        ? `${scoreResult.score} _(auto)_`
        : `__ _(manual)_`
      : `__ `;
    return `| ${q.id} | ${q.topic} | ${q.category} | ${escaped} | ${scoreCell} |`;
  }).join('\n');

  const stumpLine = stumpMax > 0
    ? `\n**Stump questions (${stumpCount}):** ${stumpTotal}/${stumpMax} (${Math.round(stumpTotal / stumpMax * 100)}% — answers require reading profile)`
    : '';
  const profileLine = baseline
    ? `**Mode:** BASELINE (no profile — training data only)`
    : `**Profile size:** ~${tokenEst} tokens (CHODE)`;
  const tokenLine = usage.promptTokens > 0
    ? `**Token usage:** ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.promptTokens + usage.completionTokens} total`
    : '';

  return `# CHODE Benchmark — ${model}
**Date:** ${date}
**Model:** ${model}
**Provider:** ${provider}
**Repo:** ${repoName}
${profileLine}${tokenLine ? `\n${tokenLine}` : ''}
**Questions parsed:** ${answers.size}/${questions.length}${missing.length ? ` (missing: ${missing.join(', ')})` : ''}
**Auto-scored:** ${autoScored.length}/${questions.length} questions → ${autoTotal}/${autoMax} (${Math.round(autoTotal / autoMax * 100)}% of auto-scorable)${stumpLine}
**Manual scoring needed:** ${manualCount} questions

> Claude R3 baseline: 62/90 = 68.9%
> Score each \`__(manual)_\` answer: 0=wrong/absent, 1=partial, 2=mostly correct, 3=correct+complete

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
${rows}

**Total: __/${questions.length * 3}** _(fill in manual scores above, add to auto total of ${autoTotal})_

---

## Raw Model Response

\`\`\`
${raw}
\`\`\`
`;
}

// ── Self-profile mode ─────────────────────────────────────────────────────────

const WALK_SKIP = new Set([
  '.git', 'node_modules', '__pycache__', '.next', 'dist', 'build', 'coverage',
  'vendor', 'third_party', '.cache', 'tmp', 'log', 'logs', 'target',
  '_build', 'deps', '.elixir_ls', 'priv/static',
]);

const ANCHOR_NAMES = new Set([
  'package.json', 'go.mod', 'go.sum', 'Cargo.toml', 'pyproject.toml',
  'requirements.txt', 'Gemfile', 'composer.json', 'pom.xml',
  'build.gradle', 'mix.exs', 'CMakeLists.txt', 'pubspec.yaml',
]);

const DOC_NAMES = new Set([
  'readme.md', 'readme.mdx', 'readme.rst', 'contributing.md', 'contributing.rst',
  'changelog.md', 'claude.md', 'agents.md', 'code_of_conduct.md', 'security.md',
]);

async function walkRepo(root: string): Promise<string[]> {
  const results: string[] = [];
  const rootNorm = root.replace(/\\/g, '/');

  async function recurse(dir: string, depth: number): Promise<void> {
    if (depth > 6) return;
    let entries: Awaited<ReturnType<typeof readdir>>;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (WALK_SKIP.has(e.name)) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await recurse(full, depth + 1);
      } else if (e.isFile()) {
        results.push(full.replace(/\\/g, '/'));
      }
    }
  }

  await recurse(root, 0);
  return results;
}

type RepoInputs = {
  fileTree: string[];       // all relative paths
  anchorFiles: Array<{ name: string; content: string }>;
  docFiles: Array<{ name: string; path: string; content: string }>;
};

async function gatherRepoInputs(root: string): Promise<RepoInputs> {
  const rootNorm = root.replace(/\\/g, '/').replace(/\/?$/, '/');
  const allFiles = await walkRepo(root);

  const toRel = (p: string) => p.replace(rootNorm, '');
  const fileTree = allFiles.map(toRel).sort();

  const anchorFiles: RepoInputs['anchorFiles'] = [];
  const docFiles: RepoInputs['docFiles'] = [];

  for (const path of allFiles) {
    const name = basename(path);
    const rel = toRel(path);
    const depth = rel.split('/').filter(Boolean).length;

    if (ANCHOR_NAMES.has(name) && depth <= 2) {
      try {
        let content = await readFile(path, 'utf8');
        if (content.length > 4000) content = content.slice(0, 4000) + '\n...(truncated)';
        anchorFiles.push({ name: rel, content });
      } catch {}
    }

    if (/\.(md|mdx|rst)$/i.test(name) && depth <= 2) {
      const low = name.toLowerCase();
      // Skip dirs that are noise
      const parts = rel.split('/').filter(Boolean);
      const inSkipDir = parts.slice(0, -1).some(p =>
        ['examples','fixtures','test','tests','benchmarks','demos','samples','node_modules','.github'].includes(p.toLowerCase())
      );
      if (!inSkipDir && (DOC_NAMES.has(low) || depth === 1)) {
        try {
          let content = await readFile(path, 'utf8');
          if (content.length > 6000) content = content.slice(0, 6000) + '\n...(truncated)';
          docFiles.push({ name: rel, path, content });
        } catch {}
      }
    }
  }

  return { fileTree, anchorFiles, docFiles };
}

const MAX_TREE_PATHS = 3000;    // ~30k tokens for file tree
const MAX_TOTAL_CHARS = 280000; // ~70k tokens total input cap

function buildSelfProfileInputPrompt(inputs: RepoInputs): string {
  const sections: string[] = [];

  // File tree: cap at MAX_TREE_PATHS, show directory summary for overflow
  const tree = inputs.fileTree;
  if (tree.length <= MAX_TREE_PATHS) {
    sections.push(`## File Tree (${tree.length} files)\n${tree.join('\n')}`);
  } else {
    const shown = tree.slice(0, MAX_TREE_PATHS);
    const overflow = tree.slice(MAX_TREE_PATHS);
    // Summarize overflow by top-level dir
    const dirCounts: Record<string, number> = {};
    for (const p of overflow) {
      const top = p.split('/')[0] ?? '(root)';
      dirCounts[top] = (dirCounts[top] ?? 0) + 1;
    }
    const summary = Object.entries(dirCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([d, n]) => `  ${d}/  (+${n} files)`)
      .join('\n');
    sections.push(`## File Tree (${tree.length} files — first ${MAX_TREE_PATHS} shown)\n${shown.join('\n')}\n\n(${overflow.length} additional files in:\n${summary}\n)`);
  }

  for (const f of inputs.anchorFiles) {
    sections.push(`## ${f.name}\n\`\`\`\n${f.content}\n\`\`\``);
  }

  for (const f of inputs.docFiles) {
    sections.push(`## ${f.name}\n${f.content}`);
  }

  // Hard cap total chars to stay within model context limits
  let result = sections.join('\n\n---\n\n');
  if (result.length > MAX_TOTAL_CHARS) {
    result = result.slice(0, MAX_TOTAL_CHARS) + '\n\n...(input truncated at token limit)';
  }
  return result;
}

function buildSelfProfileBuildPrompt(repoInputs: string): string {
  return `You are analyzing a software repository. Here are its files:

${repoInputs}

---

Build a compressed profile of this repository. Include:
- Primary language(s) and version
- Framework(s) and key libraries
- Package manager(s)
- Test framework(s) and test commands
- Project type (library, framework, CLI, application, monorepo)
- Primary purpose in 1-2 sentences
- Top directories and approximate file counts
- Key entry point files
- Architecture pattern (if identifiable)
- Notable conventions or gotchas

Be concise — target 400-600 words. Use plain text, no markdown headers needed.`;
}

function buildSelfProfileQuestionPrompt(profile: string, questions: QuestionDef[]): string {
  const n = questions.length;
  const last = questions[n - 1]?.id ?? `Q${n}`;
  const questionList = questions.map(q => `${q.id}: ${q.text}`).join('\n');

  return `You previously analyzed a repository and built this profile:

${profile}

Now answer the following ${n} questions using ONLY the information in your profile above.
If the information is not in your profile, answer: "Not in profile."
Format: write the label (Q1, Q2, etc.) on its own line, then your answer on the next line.

THE ${n} QUESTIONS:
${questionList}

Now answer Q1 through ${last}.`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const model = get('--model');
  const provider = get('--provider') ?? 'ollama';
  const keyArg = get('--key') ?? process.env['OPENROUTER_API_KEY'];
  const chodeArg = get('--chode');

  const baseline = args.includes('--baseline');
  const selfProfile = args.includes('--self-profile');

  if (!model) {
    console.error('Usage: benchmark.ts --model <name> [--provider ollama|openrouter] [--key <api-key>] [--chode <path>] [--baseline|--self-profile]');
    process.exit(1);
  }

  if (provider === 'openrouter' && !keyArg) {
    console.error('OpenRouter requires --key or OPENROUTER_API_KEY env var');
    process.exit(1);
  }

  const chodeFile = chodeArg
    ? resolve(chodeArg)
    : resolve('F:/projects/benchmarks/gitea/.chode');

  let chodeContent: string;
  try {
    chodeContent = await readFile(chodeFile, 'utf8');
  } catch {
    console.error(`Cannot read .chode file: ${chodeFile}`);
    process.exit(1);
  }

  // Derive repo name from .chode path (parent directory name)
  const repoName = basename(resolve(chodeFile, '..'));

  const modeLabel = selfProfile ? 'SELF-PROFILE (raw docs → AI builds profile)'
    : baseline ? 'BASELINE (training knowledge only)'
    : `CHODE (~${Math.ceil(chodeContent.length / 4)} tokens)`;

  console.log(`\nCHODE Benchmark`);
  console.log(`  Provider: ${provider}`);
  console.log(`  Model:    ${model}`);
  console.log(`  Repo:     ${repoName}`);
  console.log(`  Mode:     ${modeLabel}`);
  console.log();

  // Validate Ollama model availability
  if (provider === 'ollama') {
    const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`).catch(() => null);
    if (!tagsRes?.ok) {
      console.error(`Cannot reach Ollama at ${OLLAMA_URL}`);
      process.exit(1);
    }
    const tags = await tagsRes.json() as { models: Array<{ name: string }> };
    const found = tags.models.some(m => m.name === model || m.name === model + ':latest');
    if (!found) {
      console.error(`Model "${model}" not found in Ollama. Pull with: ollama pull ${model}`);
      console.error(`Available: ${tags.models.map(m => m.name).join(', ')}`);
      process.exit(1);
    }
  }

  // Select question set: use per-repo questions if available, else generic 30
  const questions = REPO_QUESTIONS[repoName] ?? QUESTIONS;
  const gt = REPO_GT[repoName] ?? (GROUND_TRUTH_MAP[repoName] ?? {});

  console.log(`  Questions: ${questions.length} (${REPO_QUESTIONS[repoName] ? 'repo-specific' : 'generic'})`);

  // ── Self-profile mode: two-call approach ──────────────────────────────────
  if (selfProfile) {
    const repoRoot = resolve(chodeFile, '..');
    console.log(`  Gathering repo inputs from: ${repoRoot}`);
    const inputs = await gatherRepoInputs(repoRoot);
    const rawInputText = buildSelfProfileInputPrompt(inputs);
    const inputCharCount = rawInputText.length;
    const inputTokenEst = Math.ceil(inputCharCount / 4);
    console.log(`  Raw inputs: ${inputs.fileTree.length} files, ${inputs.anchorFiles.length} anchors, ${inputs.docFiles.length} docs (~${inputTokenEst} tokens est.)`);

    // Call 1: build profile from raw repo inputs
    console.log(`  Call 1: building profile...`);
    const start1 = Date.now();
    let aiProfile = '';
    let buildUsage = { promptTokens: 0, completionTokens: 0 };
    try {
      const buildPromptText = buildSelfProfileBuildPrompt(rawInputText);
      const r1 = provider === 'openrouter'
        ? await queryOpenRouter(model, keyArg!, buildPromptText)
        : await queryOllama(model, buildPromptText);
      aiProfile = r1.content;
      buildUsage = { promptTokens: r1.promptTokens, completionTokens: r1.completionTokens };
    } catch (e) {
      console.error(`Profile build failed: ${e}`);
      process.exit(1);
    }
    console.log(`  Done in ${((Date.now() - start1) / 1000).toFixed(1)}s — input: ${buildUsage.promptTokens} tokens, profile: ${buildUsage.completionTokens} tokens`);

    // Call 2: answer questions using the AI-built profile
    console.log(`  Call 2: answering questions...`);
    const start2 = Date.now();
    let raw = '';
    let answerUsage = { promptTokens: 0, completionTokens: 0 };
    try {
      const qPrompt = buildSelfProfileQuestionPrompt(aiProfile, questions);
      const r2 = provider === 'openrouter'
        ? await queryOpenRouter(model, keyArg!, qPrompt)
        : await queryOllama(model, qPrompt);
      raw = r2.content;
      answerUsage = { promptTokens: r2.promptTokens, completionTokens: r2.completionTokens };
    } catch (e) {
      console.error(`Question answering failed: ${e}`);
      process.exit(1);
    }
    console.log(`  Done in ${((Date.now() - start2) / 1000).toFixed(1)}s`);

    const { answers, missing } = parseAnswers(raw, questions);
    if (missing.length > 0) console.warn(`  WARNING: ${missing.length} not parsed: ${missing.join(', ')}`);

    const scores = new Map<string, ScoreResult>();
    for (const q of questions) {
      const result = autoScore(q.id, answers.get(q.id) ?? '', gt[q.id] ?? null);
      if (result.score !== -1 || !result.auto) scores.set(q.id, result);
    }
    const autoScored = [...scores.values()].filter(s => s.auto);
    const autoTotal = autoScored.reduce((n, s) => n + s.score, 0);
    console.log(`  Auto-scored: ${autoScored.length} questions → ${autoTotal}/${autoScored.length * 3}`);

    const modelSlug = model.replace(/[:/]/g, '-');
    const date = new Date().toISOString().slice(0, 10);
    const outDir = resolve(__dirname, 'results');
    await mkdir(outDir, { recursive: true });
    const outFile = resolve(outDir, `${repoName}-${modelSlug}-self-profile-${date}.md`);

    const chodeTokenEst = Math.ceil(chodeContent.length / 4);
    const stumpCount = questions.filter(q => q.stump).length;
    const stumpScored = questions.filter(q => q.stump).map(q => scores.get(q.id)).filter(s => s?.auto);
    const stumpTotal = stumpScored.reduce((n, s) => n + (s?.score ?? 0), 0);
    const stumpMax = stumpScored.length * 3;

    const rows = questions.map(q => {
      const answer = answers.get(q.id) ?? '_(not parsed)_';
      const short = answer.length > 250 ? answer.slice(0, 250).replace(/\s+\S*$/, '…') : answer;
      const escaped = short.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      const sr = scores.get(q.id);
      const scoreCell = sr ? (sr.auto ? `${sr.score} _(auto)_` : `__ _(manual)_`) : `__ `;
      return `| ${q.id} | ${q.topic} | ${q.category} | ${escaped} | ${scoreCell} |`;
    }).join('\n');

    const output = `# CHODE Benchmark — Self-Profile Mode — ${model}
**Date:** ${new Date().toISOString().slice(0, 10)}
**Model:** ${model}
**Provider:** ${provider}
**Repo:** ${repoName}
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** ${inputs.fileTree.length} paths, ${inputs.anchorFiles.length} anchor files, ${inputs.docFiles.length} doc files
**Call 1 — profile build:** ${buildUsage.promptTokens} prompt tokens → ${buildUsage.completionTokens} completion tokens (profile)
**Call 2 — questions:** ${answerUsage.promptTokens} prompt tokens + ${answerUsage.completionTokens} completion tokens
**Total tokens consumed:** ${buildUsage.promptTokens + buildUsage.completionTokens + answerUsage.promptTokens + answerUsage.completionTokens}

**CHODE equivalent:** ~${chodeTokenEst} tokens (pre-computed, no Call 1 needed)
**Token ratio:** ${Math.round(buildUsage.promptTokens / chodeTokenEst)}x more input tokens vs CHODE profile

**Questions parsed:** ${answers.size}/${questions.length}${missing.length ? ` (missing: ${missing.join(', ')})` : ''}
**Auto-scored:** ${autoScored.length}/${questions.length} questions → ${autoTotal}/${autoScored.length * 3} (${Math.round(autoTotal / (autoScored.length * 3) * 100)}% of auto-scorable)${stumpMax > 0 ? `\n**Stump questions (${stumpCount}):** ${stumpTotal}/${stumpMax} (${Math.round(stumpTotal / stumpMax * 100)}%)` : ''}

---

## AI-Built Profile

\`\`\`
${aiProfile}
\`\`\`

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
${rows}

**Total: __/${questions.length * 3}**

---

## Raw Answer Response

\`\`\`
${raw}
\`\`\`
`;
    await writeFile(outFile, output, 'utf8');
    console.log(`\n  Results: ${outFile}`);
    return;
  }

  // ── Standard CHODE / baseline flow ───────────────────────────────────────
  console.log(`  Querying...`);
  const start = Date.now();

  let raw = '';
  let usage: { promptTokens: number; completionTokens: number } = { promptTokens: 0, completionTokens: 0 };
  try {
    const prompt = buildPrompt(baseline ? '' : chodeContent, questions, baseline);
    const result = provider === 'openrouter'
      ? await queryOpenRouter(model, keyArg!, prompt)
      : await queryOllama(model, prompt);
    raw = result.content;
    usage = { promptTokens: result.promptTokens, completionTokens: result.completionTokens };
  } catch (e) {
    console.error(`Query failed: ${e}`);
    process.exit(1);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  Done in ${elapsed}s`);
  if (usage.promptTokens > 0) {
    console.log(`  Tokens: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.promptTokens + usage.completionTokens} total`);
  }

  const { answers, missing } = parseAnswers(raw, questions);
  if (missing.length > 0) {
    console.warn(`  WARNING: ${missing.length} questions not parsed: ${missing.join(', ')}`);
  }
  console.log(`  Parsed ${answers.size}/${questions.length} answers`);

  // Auto-score
  const scores = new Map<string, ScoreResult>();
  for (const q of questions) {
    const answer = answers.get(q.id) ?? '';
    const result = autoScore(q.id, answer, gt[q.id] ?? null);
    if (result.score !== -1 || !result.auto) scores.set(q.id, result);
  }

  const autoScored = [...scores.values()].filter(s => s.auto);
  const autoTotal = autoScored.reduce((n, s) => n + s.score, 0);
  console.log(`  Auto-scored: ${autoScored.length} questions → ${autoTotal}/${autoScored.length * 3}`);

  const modelSlug = model.replace(/[:/]/g, '-');
  const date = new Date().toISOString().slice(0, 10);
  const outDir = resolve(__dirname, 'results');
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, `${repoName}-${modelSlug}${baseline ? '-baseline' : ''}-${date}.md`);

  const output = buildOutput(model, provider, chodeFile, chodeContent, raw, answers, missing, scores, repoName, questions, usage, baseline);
  await writeFile(outFile, output, 'utf8');

  console.log(`\n  Results: ${outFile}`);
}

main().catch(e => { console.error(e); process.exit(1); });
