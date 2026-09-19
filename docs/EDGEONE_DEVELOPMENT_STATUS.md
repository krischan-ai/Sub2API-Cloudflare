# Sub2API EdgeOne Migration Status

## Current milestone

Milestone 1: Database abstraction

## Completed

- EdgeOne deployment scaffold
- Database adapter interface
- D1 adapter compatibility layer
- Runtime database selector
- PostgreSQL adapter migration point

## Next

1. Replace repository direct D1 access with DatabaseAdapter.
2. Add PostgreSQL implementation using DATABASE_URL.
3. Convert D1 migration SQL to PostgreSQL schema.
4. Validate EdgeOne Cloud Functions runtime.

## Acceptance goals

- Existing Cloudflare D1 deployment remains functional.
- EdgeOne deployment can switch database backend by environment variables.
- API behavior remains unchanged during migration.
