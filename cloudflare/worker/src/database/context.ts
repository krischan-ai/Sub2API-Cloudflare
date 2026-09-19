import { D1Adapter } from "./d1.ts";
import { PostgresAdapter } from "./postgres.ts";
import type { DatabaseAdapter } from "./adapter.ts";

/**
 * Runtime database selector for multi-platform deployment.
 *
 * Cloudflare keeps using D1 while EdgeOne deployments can inject
 * PostgreSQL through DATABASE_DRIVER=postgres.
 */
export interface DatabaseEnv {
    DB?: unknown;
    DATABASE_DRIVER?: string;
    DATABASE_URL?: string;
}

export function createDatabase(env: DatabaseEnv): DatabaseAdapter {
    const driver = env.DATABASE_DRIVER?.toLowerCase();

    if (driver === "postgres") {
        if (!env.DATABASE_URL) {
            throw new Error("DATABASE_URL is required when DATABASE_DRIVER=postgres");
        }
        return new PostgresAdapter(env.DATABASE_URL);
    }

    if (!env.DB) {
        throw new Error("Database binding is missing");
    }

    return new D1Adapter(env.DB as never);
}
