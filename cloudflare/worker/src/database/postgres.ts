import { Pool, type PoolClient, type QueryResultRow } from "pg";
import type { DatabaseAdapter, DatabaseResult, DatabaseStatement, DatabaseValue } from "./adapter.ts";

type QueryExecutor = Pick<Pool, "query"> | Pick<PoolClient, "query">;

/** A prepared SQL statement backed by PostgreSQL parameterized queries. */
class PostgresStatement implements DatabaseStatement {
    private values: DatabaseValue[] = [];

    constructor(
        private readonly executor: QueryExecutor,
        private readonly query: string,
    ) {}

    bind(...values: DatabaseValue[]): DatabaseStatement {
        this.values = values;
        return this;
    }

    async first<T = Record<string, unknown>>(): Promise<T | null> {
        const result = await this.executor.query<T & QueryResultRow>(this.query, this.values);
        return result.rows[0] ?? null;
    }

    async all<T = Record<string, unknown>>(): Promise<T[]> {
        const result = await this.executor.query<T & QueryResultRow>(this.query, this.values);
        return result.rows;
    }

    async execute<T = Record<string, unknown>>(): Promise<DatabaseResult<T>> {
        const result = await this.executor.query<T & QueryResultRow>(this.query, this.values);
        return {
            results: result.rows,
            changes: result.rowCount ?? 0,
        };
    }
}

/** PostgreSQL adapter for EdgeOne Node.js Cloud Functions. */
export class PostgresAdapter implements DatabaseAdapter {
    private readonly pool: Pool;
    private activeClient?: PoolClient;

    constructor(connectionString: string) {
        if (!connectionString.trim()) {
            throw new Error("DATABASE_URL is required for the PostgreSQL adapter");
        }
        this.pool = new Pool({ connectionString, max: 5 });
    }

    prepare(query: string): DatabaseStatement {
        if (!query.trim()) throw new Error("SQL query cannot be empty");
        return new PostgresStatement(this.activeClient ?? this.pool, query);
    }

    async transaction<T>(callback: () => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            this.activeClient = client;
            const value = await callback();
            await client.query("COMMIT");
            return value;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            this.activeClient = undefined;
            client.release();
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}
