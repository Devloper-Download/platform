import { create } from "zustand"
import type { Database } from "sql.js"
import { createDb, executeQuery } from "../../lib/sqlite"

interface DbInstance {
    id: string
    db: Database
    fileName: string
    tables: string[]
}

interface DbState {
    databases: DbInstance[]
    activeDbId: string | null
    isLoading: boolean
    error: string | null

    // Actions
    loadDbFromFile: (file: File) => Promise<void>
    createEmptyDb: () => Promise<void>
    setActiveDb: (id: string) => void
    closeDb: (id: string) => void
    runQuery: (query: string, dbId?: string) => Promise<{ columns: string[], values: any[][] }>
    refreshTables: (dbId?: string) => void
    getActiveDb: () => DbInstance | undefined
}

export const useDbStore = create<DbState>((set, get) => ({
    databases: [],
    activeDbId: null,
    isLoading: false,
    error: null,

    loadDbFromFile: async (file: File) => {
        set({ isLoading: true, error: null })
        try {
            const buffer = await file.arrayBuffer()
            const u8array = new Uint8Array(buffer)
            const db = await createDb(u8array)

            // Get tables
            const result = executeQuery(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            const tables = result.values.flat() as string[]

            const newDb: DbInstance = {
                id: crypto.randomUUID(),
                db,
                fileName: file.name,
                tables
            }

            set(state => ({
                databases: [...state.databases, newDb],
                activeDbId: newDb.id,
                isLoading: false
            }))
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false })
        }
    },

    createEmptyDb: async () => {
        set({ isLoading: true, error: null })
        try {
            const db = await createDb()
            const newDb: DbInstance = {
                id: crypto.randomUUID(),
                db,
                fileName: "new-database.db",
                tables: []
            }
            set(state => ({
                databases: [...state.databases, newDb],
                activeDbId: newDb.id,
                isLoading: false
            }))
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false })
        }
    },

    setActiveDb: (id: string) => {
        set({ activeDbId: id })
    },

    closeDb: (id: string) => {
        set(state => {
            const newDatabases = state.databases.filter(d => d.id !== id)
            let newActiveId = state.activeDbId
            if (state.activeDbId === id) {
                newActiveId = newDatabases.length > 0 ? newDatabases[newDatabases.length - 1].id : null
            }
            return { databases: newDatabases, activeDbId: newActiveId }
        })
    },

    runQuery: async (query: string, dbId?: string) => {
        const { databases, activeDbId } = get()
        const targetId = dbId || activeDbId
        const targetDb = databases.find(d => d.id === targetId)

        if (!targetDb) throw new Error("No database loaded")
        return executeQuery(targetDb.db, query)
    },

    refreshTables: (dbId?: string) => {
        const { databases, activeDbId } = get()
        const targetId = dbId || activeDbId
        const targetDbIndex = databases.findIndex(d => d.id === targetId)

        if (targetDbIndex === -1) return

        try {
            const db = databases[targetDbIndex].db
            const result = executeQuery(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            const tables = result.values.flat() as string[]

            set(state => {
                const newDatabases = [...state.databases]
                newDatabases[targetDbIndex] = { ...newDatabases[targetDbIndex], tables }
                return { databases: newDatabases }
            })
        } catch (err) {
            console.error("Failed to refresh tables", err)
        }
    },

    getActiveDb: () => {
        const { databases, activeDbId } = get()
        return databases.find(d => d.id === activeDbId)
    }
}))
