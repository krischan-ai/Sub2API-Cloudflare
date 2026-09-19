import type { D1Database } from "../types/d1.ts";
import type { DatabaseAdapter, DatabaseStatement } from "./adapter.ts";

class D1StatementAdapter implements DatabaseStatement {
    constructor(private statement: ReturnType<D1Database["prepare"]>) {}

    bind(...values: any[]): DatabaseStatement {
        this.statement = this.statement.bind(...values);
        return this;
    }

    first<T = Record<string, unknown>>(): Promise<T | null> {
        return this.statement.first<T>();
    }

    async all<T = Record<string, unknown>>(): Promise<T[]> {
        const result = await this.statement.all<T>();
        return result.results ?? [];
    }

    async execute<T = Record<string, unknown>>() {
        const result = await this.statement.run<T>();
        return {
            results: result.results,
            changes: result.meta?.changes,
            lastInsertId: result.meta?.last_row_id,
        };
    }
}

export class D1Adapter implements DatabaseAdapter {
    constructor(private readonly db: D1Database) {}

    prepare(query: string): DatabaseStatement {
        return new D1StatementAdapter(this.db.prepare(query));
    }
}
