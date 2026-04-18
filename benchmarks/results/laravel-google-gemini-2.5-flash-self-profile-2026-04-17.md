# CHODE Benchmark — Self-Profile Mode — google/gemini-2.5-flash
**Date:** 2026-04-17
**Model:** google/gemini-2.5-flash
**Provider:** openrouter
**Repo:** laravel
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 62 paths, 2 anchor files, 2 doc files
**Call 1 — profile build:** 4924 prompt tokens → 755 completion tokens (profile)
**Call 2 — questions:** 1008 prompt tokens + 198 completion tokens
**Total tokens consumed:** 6885

**CHODE equivalent:** ~237 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 21x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 16/36 (44% of auto-scorable)
**Stump questions (5):** 3/15 (20%)

---

## AI-Built Profile

```
This is a Laravel application repository.

Primary Language and Version: PHP 8.3+

Frameworks and Key Libraries:
- Laravel Framework 13.0+
- Laravel Tinker 3.0+
- Vite 8.0+ (for frontend asset compilation)
- Tailwind CSS 4.0+

Package Managers:
- Composer (for PHP dependencies)
- npm (for JavaScript dependencies)

Test Frameworks and Commands:
- PHPUnit 12.5.12+ (for PHP testing)
- Test command: `composer test` (which runs `@php artisan test`)

Project Type: Application

Primary Purpose: This repository provides the skeleton for a Laravel web application, offering a robust foundation for building web projects with expressive syntax and a comprehensive set of tools.

Top Directories and Approximate File Counts:
- `app/` (3 files): Core application logic (controllers, models, providers).
- `bootstrap/` (3 files): Framework bootstrapping.
- `config/` (10 files): Application configuration.
- `database/` (5 files): Database migrations, factories, and seeders.
- `public/` (4 files): Web server entry point and static assets.
- `resources/` (3 files): Frontend assets (CSS, JS) and views.
- `routes/` (2 files): Web and console routes.
- `storage/` (8 files): Application generated files (logs, cache, sessions).
- `tests/` (3 files): Application tests.
- `.github/workflows/` (4 files): GitHub Actions for CI/CD.

Key Entry Point Files:
- `public/index.php`: The primary entry point for web requests.
- `artisan`: The command-line interface for Laravel.
- `bootstrap/app.php`: Initializes the Laravel application.

Architecture Pattern:
This repository follows the Model-View-Controller (MVC) architectural pattern, which is standard for Laravel applications. It also incorporates a service-oriented approach with providers and a clear separation of concerns.

Notable Conventions or Gotchas:
- **Composer Scripts**: The `composer.json` defines several useful scripts, including `setup` for initial project configuration (installing dependencies, generating key, running migrations, building assets), `dev` for local development (running server, queue, logs, and Vite concurrently), and `test` for running tests.
- **Vite Integration**: The project uses Vite for frontend asset compilation, indicated by `vite.config.js` and `package.json` scripts.
- **GitHub Actions**: The `.github/workflows` directory shows a strong emphasis on CI/CD, with workflows for issues, pull requests, tests, and changelog updates.
- **Security Focus**: Recent changelog entries highlight security considerations, such as preventing malicious code execution via `postinstall` scripts and pinning `axios` versions. The `composer.json` also explicitly disables process timeouts for the `dev` script, which can be a gotcha for long-running development processes.
- **Laravel Boost**: The `README.md` mentions "Laravel Boost" for AI workflow, suggesting an emphasis on developer tooling and AI-assisted development.
- **Changelog Format**: The `CHANGELOG.md` follows a consistent format with version numbers, dates, and links to GitHub comparisons and pull requests.
- **Environment Configuration**: The `post-root-package-install` script automatically copies `.env.example` to `.env` if it doesn't exist, streamlining environment setup.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | PHP 8.3+ | 3 _(auto)_ |
| Q2 | Test framework | Objective | PHPUnit 12.5.12+ | 3 _(auto)_ |
| Q3 | Package manager | Objective | Composer (for PHP dependencies) and npm (for JavaScript dependencies) | 3 _(auto)_ |
| Q4 | Routes location | Navigational | `routes/` (specifically `routes/web.php` based on common Laravel conventions, though the profile only states `routes/` with 2 files, implying `web.php` and `console.php` or similar) | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) architectural pattern | 0 _(auto)_ |
| Q6 | Session env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q7 | DB connection env var | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | Application | 0 _(auto)_ |
| Q12 | Primary purpose | Objective | This repository provides the skeleton for a Laravel web application, offering a robust foundation for building web projects with expressive syntax and a comprehensive set of tools. | 1 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
PHP 8.3+

Q2:
PHPUnit 12.5.12+

Q3:
Composer (for PHP dependencies) and npm (for JavaScript dependencies)

Q4:
`routes/` (specifically `routes/web.php` based on common Laravel conventions, though the profile only states `routes/` with 2 files, implying `web.php` and `console.php` or similar)

Q5:
Model-View-Controller (MVC) architectural pattern

Q6:
Not in profile.

Q7:
Not in profile.

Q8:
Not in profile.

Q9:
GitHub Actions

Q10:
Not in profile.

Q11:
Application

Q12:
This repository provides the skeleton for a Laravel web application, offering a robust foundation for building web projects with expressive syntax and a comprehensive set of tools.
```
