# api

NestJS backend for [Overloaded](../../README.md). PostgreSQL via Prisma, JWT auth, Zod-validated requests, and roadmap generation via Anthropic Claude.

See the [root README](../../README.md) for architecture, the data model, the API reference, and setup instructions.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start in watch mode |
| `pnpm build` | Compile with `nest build` |
| `pnpm start:prod` | Run the compiled output |
| `pnpm lint` | Lint and auto-fix |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm prisma:generate` | Regenerate the Prisma client from `prisma/schema.prisma` |
| `pnpm prisma:migrate` | Apply migrations |
| `pnpm prisma:seed` | Seed the `companies` table |
