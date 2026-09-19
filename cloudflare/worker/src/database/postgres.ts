import type { DatabaseAdapter } from "./adapter.ts";

/**
 * PostgreSQL adapter placeholder.
 *
 * This implementation will be enabled after the D1 repositories are migrated
 * behind the DatabaseAdapter interface.
 */
export class PostgresAdapter implements DatabaseAdapter {
    constructor(private readonly connectionString: string) {}

    async prepare(_query: string): Promise<never> {
        throw new Error(
            `PostgreSQL adapter is not implemented yet. Connection configured: ${Boolean(this.connectionString)}`,
        );
    }

    async transaction<T>(callback: () => Promise<T>): Promise<T> {
        return callback();
    }
}
