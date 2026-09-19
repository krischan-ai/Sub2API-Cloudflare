import { D1Adapter } from "./d1.ts";
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
        throw new Error("PostgreSQL adapter is not enabled yet. Configure postgres adapter in the next migration step.");
    }

    if (!env.DB) {
        throw new Error("Database binding is missing");
    }

    return new D1Adapter(env.DB as never);
}
