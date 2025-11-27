import { Search, Table as TableIcon, ChevronRight, ChevronDown, Columns } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { useDbStore } from "./db-store"

interface TableListProps {
    tables: string[]
    selectedTable: string | null
    onSelectTable: (table: string) => void
    className?: string
}

export default function TableList({ tables, selectedTable, onSelectTable, className }: TableListProps) {
    const [search, setSearch] = useState("")
    const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())
    const [tableColumns, setTableColumns] = useState<Record<string, string[]>>({})
    const { runQuery } = useDbStore()

    const filteredTables = tables.filter(t => t.toLowerCase().includes(search.toLowerCase()))

    const toggleTable = async (table: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const newExpanded = new Set(expandedTables)
        if (newExpanded.has(table)) {
            newExpanded.delete(table)
        } else {
            newExpanded.add(table)
            if (!tableColumns[table]) {
                try {
                    const res = await runQuery(`PRAGMA table_info("${table}")`)
                    const cols = res.values.map((row: any) => row[1] as string)
                    setTableColumns(prev => ({ ...prev, [table]: cols }))
                } catch (err) {
                    console.error("Failed to fetch columns for", table, err)
                }
            }
        }
        setExpandedTables(newExpanded)
    }

    return (
        <div className={cn("flex flex-col h-full border-r border-border bg-card/30 w-64 flex-shrink-0", className)}>
            <div className="p-3 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {filteredTables.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                        {tables.length === 0 ? "No tables found" : "No matches"}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredTables.map(table => (
                            <div key={table} className="flex flex-col">
                                <div
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer group",
                                        selectedTable === table
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                    onClick={() => onSelectTable(table)}
                                >
                                    <button
                                        onClick={(e) => toggleTable(table, e)}
                                        className="p-0.5 rounded-sm hover:bg-background/50 text-muted-foreground"
                                    >
                                        {expandedTables.has(table) ? (
                                            <ChevronDown className="w-3 h-3" />
                                        ) : (
                                            <ChevronRight className="w-3 h-3" />
                                        )}
                                    </button>
                                    <TableIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                                    <span className="truncate flex-1">{table}</span>
                                </div>

                                {expandedTables.has(table) && (
                                    <div className="pl-8 py-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                                        {tableColumns[table]?.map(col => (
                                            <div key={col} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5 px-1 rounded hover:bg-secondary/50 cursor-default">
                                                <Columns className="w-3 h-3 opacity-50" />
                                                <span className="truncate">{col}</span>
                                            </div>
                                        ))}
                                        {!tableColumns[table] && (
                                            <div className="text-xs text-muted-foreground pl-1">Loading...</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
