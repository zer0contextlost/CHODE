# CHODE Benchmark — Self-Profile Mode — mistralai/mistral-large-2512
**Date:** 2026-04-17
**Model:** mistralai/mistral-large-2512
**Provider:** openrouter
**Repo:** laravel
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 62 paths, 2 anchor files, 2 doc files
**Call 1 — profile build:** 4692 prompt tokens → 684 completion tokens (profile)
**Call 2 — questions:** 926 prompt tokens + 132 completion tokens
**Total tokens consumed:** 6434

**CHODE equivalent:** ~237 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 20x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 18/36 (50% of auto-scorable)
**Stump questions (5):** 3/15 (20%)

---

## AI-Built Profile

```
This repository is a Laravel application skeleton, specifically version 13.x (as indicated by the composer.json and CHANGELOG.md). The primary language is PHP 8.3+, with JavaScript/TypeScript used for frontend assets.

The core framework is Laravel 13, a PHP web application framework. Key libraries include:
- Laravel components (Eloquent ORM, Blade templating, Artisan CLI)
- Vite 8 for frontend asset bundling
- Tailwind CSS 4 for styling
- PHPUnit 12 for testing
- Faker for test data generation
- Laravel Pint for code styling
- Laravel Pail for log viewing

Package managers used are Composer (PHP) and npm (JavaScript). The test framework is PHPUnit, with test commands like `composer test` (which runs `php artisan test`). The project is a web application skeleton/template rather than a library or framework.

The primary purpose is to provide a pre-configured starting point for building Laravel web applications, including all necessary boilerplate, configuration, and tooling for modern PHP development.

Top directories and approximate file counts:
- config/ (10 files) - Application configuration
- app/ (3 main files + subdirectories) - Core application code
- database/ (5 files + migrations) - Database migrations and seeders
- resources/ (3 files + views/css/js) - Frontend assets and templates
- routes/ (2 files) - Application routes
- tests/ (3 files) - Test cases
- storage/ (multiple .gitignore files) - Logs, cache, and compiled views
- public/ (3 files) - Web-accessible assets

Key entry point files include:
- public/index.php - Main HTTP request handler
- artisan - CLI entry point
- bootstrap/app.php - Application bootstrapping
- routes/web.php - Primary web routes

The architecture follows Laravel's conventional Model-View-Controller (MVC) pattern with service providers. The application uses Laravel's service container for dependency injection and follows PSR-4 autoloading standards.

Notable conventions and gotchas:
1. Uses Vite instead of Laravel Mix for asset compilation
2. Includes Tailwind CSS by default for styling
3. Has pre-configured GitHub Actions workflows for CI
4. Uses Laravel Pint for code style enforcement
5. Includes Laravel Pail for real-time log viewing
6. The .chode and .chode.hash files are part of Laravel's new AI tooling integration
7. Environment configuration is split across multiple files in config/
8. Database migrations are versioned with timestamps
9. The setup script (`composer setup`) handles initial environment configuration
10. Uses concurrently for running multiple development processes
11. The dev script runs server, queue, logs, and Vite simultaneously
12. Includes security-focused configurations like ignoring scripts during npm install
13. Has comprehensive .gitignore files for storage directories
14. Uses SQLite by default for development (created automatically)
15. Includes pre-configured testing infrastructure

The repository represents a modern Laravel application setup with emphasis on developer experience, security, and AI tooling integration. It's designed to be immediately deployable while providing all necessary components for building full-featured web applications.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | PHP 8.3+ | 3 _(auto)_ |
| Q2 | Test framework | Objective | PHPUnit 12 | 3 _(auto)_ |
| Q3 | Package manager | Objective | Composer (PHP) and npm (JavaScript) | 3 _(auto)_ |
| Q4 | Routes location | Navigational | routes/web.php | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) pattern | 0 _(auto)_ |
| Q6 | Session env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q7 | DB connection env var | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | CI system | Objective | GitHub Actions | 3 _(auto)_ |
| Q10 | App structure | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | To provide a pre-configured starting point for building Laravel web applications, including all necessary boilerplate, configuration, and tooling for modern PHP development. | 2 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1:
PHP 8.3+

Q2:
PHPUnit 12

Q3:
Composer (PHP) and npm (JavaScript)

Q4:
routes/web.php

Q5:
Model-View-Controller (MVC) pattern

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
application skeleton

Q12:
To provide a pre-configured starting point for building Laravel web applications, including all necessary boilerplate, configuration, and tooling for modern PHP development.
```
