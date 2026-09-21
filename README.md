# Overloaded

![Web CI](https://github.com/Ganesh3154/overloaded/actions/workflows/web-ci.yml/badge.svg)
![Api CI](https://github.com/Ganesh3154/overloaded/actions/workflows/api-ci.yml/badge.svg)

A personalized, gamified technical interview-prep platform. Tell it your tech stack, target companies, current skill levels, and how much time you have — it generates an adaptive, week-by-week roadmap of tagged tasks (DSA, System Design, Behavioral, New Skill, Resume) to work through, and tracks completion, readiness, and XP as you go.

## Overview

A short onboarding flow captures a candidate's profile: years of experience, tech stack, target companies, self-rated skill levels (DSA / system design / behavioral), the skills they want to pick up, and how many weeks and hours per day they can dedicate. That profile is sent to an LLM (Anthropic Claude), constrained to a structured JSON schema, which returns a full multi-week plan. The plan is persisted as a graph of weeks and tasks, and the user works through it from a dashboard, checking off tasks, earning XP, and watching a readiness score move.

## Architecture

This is a pnpm + Turborepo monorepo with two applications and one shared package:

```
overloaded/
├── apps/
│   ├── web/              Next.js 16 (App Router) frontend
│   └── api/               NestJS 11 backend API
├── packages/
│   └── shared/            Shared Zod schemas, types & enums used by both apps
├── docker-compose.yml      Local PostgreSQL for development
├── turbo.json              Task pipeline (build/dev/lint/test) across the workspace
├── pnpm-workspace.yaml
├── tsconfig.base.json       Compiler flags shared by every package
└── .prettierrc              One formatting config for the whole repo
```

Request flow:

```
┌─────────────┐    REST (JSON, JWT auth)    ┌──────────────┐      Prisma      ┌────────────┐
│  apps/web   │ ───────────────────────────▶│   apps/api   │ ────────────────▶│ PostgreSQL │
│  (Next.js)  │◀─────────────────────────── │  (NestJS)    │◀──────────────── │            │
└─────────────┘                             └──────┬───────┘                  └────────────┘
                                                    │
                                                    │ structured-output request
                                                    ▼
                                            ┌────────────────────┐
                                            │  Anthropic Claude   │
                                            │ (roadmap generation)│
                                            └────────────────────┘
```

Both apps depend on `@overloaded/shared` for the request/response contracts they exchange — the onboarding form, auth credentials, and the roadmap domain's types and enums (`TaskTag`, `TaskStatus`, `RoadmapResponse`, ...). Validation schemas live there once and are consumed on both sides, instead of being hand-written twice and drifting apart.

## Tech stack

**Frontend — `apps/web`**
- Next.js 16 (App Router, Turbopack, static export)
- React 19 · TypeScript
- Tailwind CSS v4
- TanStack Query for server-state fetching/caching
- react-hook-form + Zod for forms and validation
- Recharts for dashboard charts

**Backend — `apps/api`**
- NestJS 11
- PostgreSQL via Prisma ORM 7, using the `@prisma/adapter-pg` driver adapter
- JWT auth (`@nestjs/jwt`) behind a global guard, with a `@Public()` decorator to opt individual routes out
- Zod request validation via a small custom `ZodValidationPipe`, using schemas shared with the frontend
- Anthropic SDK for roadmap generation, with the model's response constrained to a JSON schema
- Winston for structured logging
- Jest for unit tests

**Shared — `packages/shared`**
- Zod schemas and their inferred TypeScript types for onboarding, auth, and the roadmap domain
- Compiled with `tsc` to plain JS + `.d.ts`, consumed as an ordinary workspace dependency by both apps (no bundler-specific raw-TypeScript resolution tricks)

**Tooling**
- pnpm workspaces + Turborepo for task orchestration and caching across the monorepo
- ESLint (separate configs per app — Next's flat config vs. NestJS's typescript-eslint setup) and one shared Prettier config
- GitHub Actions: one CI workflow per app, each path-filtered so a change to `apps/web` doesn't trigger `apps/api`'s pipeline and vice versa, but both react to changes in `packages/shared`

## Data model

Defined in `apps/api/prisma/schema.prisma`:

| Model | Purpose |
|---|---|
| `User` | Account plus onboarding profile — experience, tech stack, skill levels, prep timeline |
| `Company` | Seeded list of companies (Google, Amazon, Meta, Microsoft, Apple, Netflix, ...) a user can target |
| `UserTargetCompany` | Join table between `User` and `Company` |
| `Roadmap` | One generated roadmap per user. Only one is `ACTIVE` at a time; generating a new one marks the previous `INACTIVE` |
| `RoadmapWeek` | A week within a roadmap, with status `PENDING` / `ONGOING` / `COMPLETED` |
| `RoadmapTask` | A single task within a week — a `TaskTag`, a `TaskStatus` (`TODO` / `COMPLETED`), a duration, and an XP value |

## API

All routes are prefixed with `/api/v1`. Every route requires a `Bearer` JWT unless marked **public**.

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Public. Create an account, returns an access token |
| `POST` | `/auth/login` | Public. Authenticate, returns an access token |
| `GET` | `/user/profile` | Get the current user's profile |
| `POST` | `/onboard` | Submit onboarding answers, marks the user onboarded |
| `GET` | `/company` | List target companies |
| `POST` | `/roadmap` | Generate a new roadmap via the LLM, deactivating any existing active one |
| `GET` | `/roadmap` | List the current user's roadmaps |
| `PATCH` | `/roadmap/task/:id` | Toggle a task's status |

Cross-cutting concerns are wired up globally in `main.ts` / `app.module.ts`:
- **`AuthGuard`** — verifies the JWT on every route unless the handler is decorated with `@Public()`; attaches the decoded payload so handlers can read it with `@User()`
- **`GlobalExceptionFilter`** — maps Prisma errors (unique constraint violations, missing records, etc.) and any unhandled exception to a consistent JSON error shape, and logs 5xx errors with a stack trace
- **`LoggingInterceptor`** / **`TransformInterceptor`** — request logging and a consistent `{ statusCode, message, data }` response envelope
- **`ZodValidationPipe`** — validates request bodies against the Zod schemas from `@overloaded/shared`

## Frontend structure

Route groups under `apps/web/src/app`:
- `(auth)` — `/login`, `/signup`
- `(app)` — `/`, `/onboarding`, `/dashboard`, `/roadmap`, `/profile`

Server data (profile, active roadmap, companies) is fetched and cached with TanStack Query. Forms use react-hook-form validated against Zod schemas — the ones shared with the API (onboarding, register/login) come from `@overloaded/shared`; page-specific ones stay local. Theme (light/dark) and the logged-in indicator are read from `localStorage` with `useSyncExternalStore` rather than an effect-plus-setState round trip, so they're correct on the very first render after hydration without an extra re-render.

## Getting started

### Prerequisites
- Node.js 24
- pnpm 11 (the root `package.json`'s `packageManager` field pins the exact version — `corepack enable` picks it up automatically)
- Docker, for local Postgres (or point at a Postgres 17 instance of your own)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start Postgres

```bash
docker compose up -d
```

### 3. Configure environment variables

`apps/api/.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string, used by Prisma's CLI (migrate/generate) |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Individual connection params used by the runtime `PrismaPg` driver adapter |
| `JWT_SECRET` | Secret used to sign and verify access tokens |
| `JWT_AUD` | Expected `aud` claim on access tokens |
| `ANTHROPIC_API_KEY` | Anthropic API key used for roadmap generation |
| `PORT` | API port (defaults to `3001`) |
| `LOG_LEVEL` | Winston log level (defaults to `debug` outside production) |

`apps/web/.env`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the frontend calls, e.g. `http://localhost:3001/api/v1` |

### 4. Run database migrations and seed companies

```bash
pnpm --filter api prisma:migrate
pnpm --filter api prisma:seed
```

### 5. Start everything

```bash
pnpm dev
```

This starts `apps/web` (http://localhost:3000), `apps/api` (http://localhost:3001), and `packages/shared`'s watch build together, orchestrated by Turborepo.

## Scripts

Run from the repo root and fanned out to every workspace package by Turborepo:

| Script | Description |
|---|---|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all apps (building `packages/shared` first, since both apps depend on it) |
| `pnpm lint` | Lint all apps |
| `pnpm format` | Format everything with Prettier |
| `pnpm test` | Run API unit tests |

Scope any of these to a single package with Turborepo's filter flag, e.g. `pnpm turbo run build --filter=api`.

## CI

Two path-filtered GitHub Actions workflows in `.github/workflows/`:
- **Web CI** — triggers on changes to `apps/web`, `packages/shared`, or shared root config (`pnpm-lock.yaml`, `turbo.json`, `tsconfig.base.json`, `.prettierrc`); lints and builds the frontend
- **Api CI** — triggers on the same shared-config paths plus `apps/api`; generates the Prisma client, then lints, builds, and unit-tests the backend

There is currently no deploy pipeline — CI covers lint/build/test only.

## Notable design decisions

- **Shared validation, not shared-by-convention.** Onboarding, auth, and roadmap shapes are defined once in `packages/shared` as Zod schemas and consumed by both apps, closing a real gap where the frontend and backend had each independently written (and drifted from) the same validation rules — including the frontend at one point enforcing a weaker password policy than the API actually required.
- **One canonical enum for task tags**, instead of three separate spellings that used to exist across the Prisma schema, the LLM-facing prompt/schema, and the frontend's display layer, bridged by hand-written translation tables.
- **Zod over class-validator for request DTOs.** A small `ZodValidationPipe` validates controller inputs against the same schemas the frontend uses, rather than maintaining parallel class-validator classes.
- **`useSyncExternalStore` over effect-based state sync** for anything backed by `localStorage` (theme, auth status), which is the pattern React itself recommends for external, SSR-unavailable state — it avoids an extra render pass and the "setState synchronously in an effect" pitfall.
