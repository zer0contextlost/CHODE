# CHODE Benchmark — Self-Profile Mode — meta-llama/llama-4-maverick
**Date:** 2026-04-17
**Model:** meta-llama/llama-4-maverick
**Provider:** openrouter
**Repo:** laravel
**Mode:** SELF-PROFILE (model builds its own profile from raw repo inputs)

**Raw input files:** 62 paths, 2 anchor files, 2 doc files
**Call 1 — profile build:** 4201 prompt tokens → 437 completion tokens (profile)
**Call 2 — questions:** 741 prompt tokens + 112 completion tokens
**Total tokens consumed:** 5491

**CHODE equivalent:** ~237 tokens (pre-computed, no Call 1 needed)
**Token ratio:** 18x more input tokens vs CHODE profile

**Questions parsed:** 12/12
**Auto-scored:** 12/12 questions → 13/36 (36% of auto-scorable)
**Stump questions (5):** 3/15 (20%)

---

## AI-Built Profile

```
The repository is a Laravel application, primarily written in PHP version 8.3. The framework used is Laravel version 13.0.

The key libraries and packages used in the project are specified in the `composer.json` file, including `laravel/tinker`, `fakerphp/faker`, `laravel/pail`, `laravel/pint`, `mockery/mockery`, `nunomaduro/collision`, and `phpunit/phpunit`. The project also uses Node.js packages managed by npm, as specified in the `package.json` file, including `tailwindcss`, `vite`, and `concurrently`.

The package managers used are Composer for PHP dependencies and npm for Node.js dependencies.

The test framework used is PHPUnit, and the test command is `php artisan test`, which is also defined in the `composer.json` file under the `test` script.

The project type is a web application.

The primary purpose of this repository is to provide a skeleton application for the Laravel framework, making it easy to start new Laravel projects. It includes the basic structure and configuration for a Laravel application.

The top directories in the repository include `app` (14 files), `config` (9 files), `database` (3 directories), `public` (4 files), `resources` (3 files), `routes` (2 files), `storage` (7 directories), and `tests` (3 files).

The key entry point files are `public/index.php`, `artisan`, and `bootstrap/app.php`.

The architecture pattern used is the Model-View-Controller (MVC) pattern, which is a standard pattern for Laravel applications.

Some notable conventions in the repository include the use of PSR-4 autoloading for PHP classes, the use of Laravel's migration system for database schema management, and the use of Vite for front-end asset management. The repository also includes a `README.md` file that provides information on how to get started with the project, as well as guidelines for contributing to the Laravel framework.

The repository is well-structured and follows standard Laravel conventions, making it easy for developers familiar with Laravel to understand and work with the code.
```

---

## Scoring Sheet

| Q | Topic | Category | Model Answer | Score |
|---|---|---|---|---|
| Q1 | Language | Objective | PHP | 3 _(auto)_ |
| Q2 | Test framework | Objective | PHPUnit | 3 _(auto)_ |
| Q3 | Package manager | Objective | Composer for PHP dependencies and npm for Node.js dependencies | 3 _(auto)_ |
| Q4 | Routes location | Navigational | routes | 3 _(auto)_ |
| Q5 | Design pattern | Inferential | Model-View-Controller (MVC) | 0 _(auto)_ |
| Q6 | Session env vars | Domain | Not in profile. | 0 _(auto)_ |
| Q7 | DB connection env var | Domain | Not in profile. | 0 _(auto)_ |
| Q8 | Password hashing env | Domain | Not in profile. | 0 _(auto)_ |
| Q9 | CI system | Objective | Not in profile. | 0 _(auto)_ |
| Q10 | App structure | Navigational | Not in profile. | 0 _(auto)_ |
| Q11 | Project type | Inferential | application skeleton | 1 _(auto)_ |
| Q12 | Primary purpose | Objective | The primary purpose of this repository is to provide a skeleton application for the Laravel framework, making it easy to start new Laravel projects. | 0 _(auto)_ |

**Total: __/36**

---

## Raw Answer Response

```
Q1
PHP

Q2
PHPUnit

Q3
Composer for PHP dependencies and npm for Node.js dependencies

Q4
routes

Q5
Model-View-Controller (MVC)

Q6
Not in profile.

Q7
Not in profile.

Q8
Not in profile.

Q9
Not in profile.

Q10
Not in profile.

Q11
application skeleton

Q12
The primary purpose of this repository is to provide a skeleton application for the Laravel framework, making it easy to start new Laravel projects.
```
