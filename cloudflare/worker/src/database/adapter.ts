export type DatabaseValue = string | number | boolean | null | ArrayBuffer;

export interface DatabaseResult<T = Record<string, unknown>> {
    results?: T[];
    changes?: number;
    lastInsertId?: number;
}

export interface DatabaseStatement {
    bind(...values: DatabaseValue[]): DatabaseStatement;
    first<T = Record<string, unknown>>(): Promise<T | null>;
    all<T = Record<string, unknown>>(): Promise<T[]>;
    execute<T = Record<string, unknown>>(): Promise<DatabaseResult<T>>;
}

export interface DatabaseAdapter {
    prepare(query: string): DatabaseStatement;
    transaction?<T>(callback: () => Promise<T>): Promise<T>;
}
