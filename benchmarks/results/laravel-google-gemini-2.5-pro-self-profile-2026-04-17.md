# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-pro
**Date:** 2026-04-17
**Model:** google/gemini-2.5-pro
**Provider:** openrouter
**Repo:** laravel
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 62 paths, 2 anchor files, 2 doc files
**Call 1 — profile build:** 4924 prompt tokens → 2618 completion tokens (profile)
**Call 2 — questions:** 1026 prompt tokens + 1332 completion tokens
**Total tokens consumed:** 9900

**CHODE equivalent:** ~237 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 21x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 17/36 (47% of auto-scorable)
**Stump questions (5):** 3/15 (20%)

---

## AI-Built Profile

```
Primary language(s) and version:
The primary language is PHP, requiring version ^8.3 as specified in `composer.json`. JavaScript is used for the frontend, configured as an ES module (`"type": "module"` in `package.json`).

Framework(s) and key libraries:
The backend is built on the Laravel framework, specifically version ^13.0. For the frontend, it uses Vite for asset bundling, integrated via the `laravel-vite-plugin`. Styling is handled by Tailwind CSS v4. Key development libraries include Laravel Pail for log tailing, Laravel Pint for code styling, and PHPUnit for testing.

Package manager(s):
The project uses two package managers: Composer for PHP packages and npm for JavaScript packages.

Test framework(s) and test commands:
The testing framework is PHPUnit ^12.5. The test suite is executed by running `composer test`, which is a shortcut for the `php artisan test` command. Test files are located in the `tests/` directory, with `phpunit.xml` serving as the configuration file.

Project type:
This is a web application skeleton. It's not a library or a finished application but rather the official boilerplate project for starting a new application with the Laravel framework.

Primary purpose in 1-2 sentences:
This repository provides a foundational structure for building modern, robust web applications using the Laravel framework. It includes a pre-configured directory layout, routing, essential dependencies, and build tooling to enable developers to start coding features immediately.

Top directories and approximate file counts:
The project is organized by function into several key directories:
- `app` (~3 files): Contains core application logic like models and controllers.
- `config` (~11 files): Holds all application configuration files.
- `database` (~6 files): Manages database schema migrations, factories, and seeders.
- `resources` (~3 files): Contains frontend assets (CSS, JS) and Blade view templates.
- `routes` (~2 files): Defines the application's web and console routes.
- `tests` (~3 files): Houses the application's feature and unit tests.
- `.github` (~4 files): Contains GitHub Actions workflows for CI/CD.

Key entry point files:
- `public/index.php`: The single entry point for all HTTP requests handled by the application.
- `artisan`: The command-line interface entry point for running Laravel's built-in commands.
- `resources/js/app.js`: The main entry point for the JavaScript application assets.
- `vite.config.js`: The configuration file for the Vite frontend build process.

Architecture pattern (if identifiable):
The repository is structured around the Model-View-Controller (MVC) architectural pattern, which is standard for the Laravel framework. This is evident from the separation of concerns in the `app/Models`, `resources/views`, and `app/Http/Controllers` directories.

Notable conventions or gotchas:
The project relies heavily on Laravel conventions, such as using an `.env` file for environment configuration and the Artisan CLI for development tasks. The `composer.json` `scripts` section is highly configured for an efficient development experience; the `dev` script uses `concurrently` to simultaneously run the PHP server, queue worker, log tailing, and Vite dev server. The `CHANGELOG.md` indicates this is a future version of Laravel that removes the `axios` HTTP client by default. The `README.md` also highlights a new focus on "Agentic Development" with the `laravel/boost` package to improve integration with AI coding tools.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | The primary language is PHP. | 3 _(auto)_ |
| Q2 | Test framework | Objective | PHPUnit | 3 _(auto)_ |
| Q3 | Package manager | Objective | Composer for PHP and npm for JavaScript. | 3 _(auto)_ |
| Q4 | Routes location | Navigational | In the `routes` directory. | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q7 | DB connection env var | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | A web application skeleton. | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | This repository provides a foundational structure for building modern, robust web applications using the Laravel framework. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
The primary language is PHP.

Q2
PHPUnit

Q3
Composer for PHP and npm for JavaScript.

Q4
In the `routes` directory.

Q5
Model-View-Controller (MVC)

Q6
Not in profile.

Q7
Not in profile.

Q8
Not in profile.

Q9
GitHub Actions

Q10
Not in profile.

Q11
A web application skeleton.

Q12
This repository provides a foundational structure for building modern, robust web applications using the Laravel framework.
```
