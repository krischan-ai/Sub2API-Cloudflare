# Sub2API EdgeOne Migration Plan

## Goal

Migrate Sub2API Cloudflare edition from Cloudflare Workers + D1 to EdgeOne Cloud Functions + PostgreSQL while keeping the existing business logic.

## Target Architecture

```
User
 |
EdgeOne Pages
 |
Cloud Functions (ap-singapore)
 |
PostgreSQL (Supabase/compatible)
 |
AI Providers
```

## Migration Stages

1. Add EdgeOne deployment scaffold.
2. Abstract database access layer.
3. Replace D1 adapter with PostgreSQL adapter.
4. Convert SQLite migrations to PostgreSQL migrations.
5. Add EdgeOne KV for cache and runtime state where suitable.
6. Validate API compatibility and streaming responses.

## Database Migration

Existing repositories should avoid direct D1 calls:

```ts
DB.prepare().bind()
```

New abstraction:

```ts
database.query()
database.queryOne()
database.execute()
```

This allows future support for PostgreSQL providers.
