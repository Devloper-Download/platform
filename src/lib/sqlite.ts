import initSqlJs from "sql.js"
import type { Database, SqlJsStatic } from "sql.js"

let SQL: SqlJsStatic | null = null

export async function initSql() {
    if (SQL) return SQL
    // @ts-ignore
    SQL = await initSqlJs({
        locateFile: (file: string) => `/${file}`,
    })
    return SQL
}

export async function createDb(data?: Uint8Array): Promise<Database> {
    const sql = await initSql()
    if (!sql) throw new Error("SQL.js not initialized")
    return new sql.Database(data)
}

export function executeQuery(db: Database, query: string) {
    try {
        const results = db.exec(query)
        if (results.length === 0) return { columns: [], values: [] }
        return results[0]
    } catch (error) {
        throw new Error((error as Error).message)
    }
}
