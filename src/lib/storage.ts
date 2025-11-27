import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface LocalFirstDB extends DBSchema {
    settings: {
        key: string
        value: any
    }
}

let dbPromise: Promise<IDBPDatabase<LocalFirstDB>>

export function initDB() {
    if (!dbPromise) {
        dbPromise = openDB<LocalFirstDB>("localfirst-dev-studio", 1, {
            upgrade(db) {
                // Old stores might exist, we can leave them or delete them. 
                // For now, we just ensure settings store exists.
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings")
                }
            },
        })
    }
    return dbPromise
}
