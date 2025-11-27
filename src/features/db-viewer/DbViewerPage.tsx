import { useState, useRef, useEffect } from "react"
import { Upload, Database, Plus, X, Table, Code, GitGraph, ChevronLeft } from "lucide-react"
import { useDbStore } from "./db-store"
import TableList from "./TableList"
import DataGrid from "./DataGrid"
import QueryEditor from "./QueryEditor"
import ErDiagram from "./er-diagram/ErDiagram"
import { cn } from "../../lib/utils"

export default function DbViewerPage() {
    const {
        databases,
        activeDbId,
        loadDbFromFile,
        createEmptyDb,
        setActiveDb,
        closeDb,
        isLoading,
        error,
        getActiveDb,
        runQuery
    } = useDbStore()

    const [activeTab, setActiveTab] = useState<"data" | "schema" | "query" | "er">("data")
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const [dataResults, setDataResults] = useState<{ columns: string[], values: any[][] }>({ columns: [], values: [] })
    const [queryResults, setQueryResults] = useState<{ columns: string[], values: any[][] }>({ columns: [], values: [] })
    const [schemaResults, setSchemaResults] = useState<{ columns: string[], values: any[][] }>({ columns: [], values: [] })
    const [queryError, setQueryError] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const activeDb = getActiveDb()

    // Fetch table data when selected table changes
    useEffect(() => {
        if (activeDb && selectedTable && activeTab === "data") {
            const fetchData = async () => {
                try {
                    const res = await runQuery(`SELECT * FROM "${selectedTable}" LIMIT 1000`)
                    setDataResults(res)
                } catch (err) {
                    console.error(err)
                }
            }
            fetchData()
        }
    }, [activeDb, selectedTable, activeTab, runQuery])

    // Fetch schema when selected table changes
    useEffect(() => {
        if (activeDb && selectedTable && activeTab === "schema") {
            const fetchSchema = async () => {
                try {
                    const res = await runQuery(`PRAGMA table_info("${selectedTable}")`)
                    setSchemaResults(res)
                } catch (err) {
                    console.error(err)
                }
            }
            fetchSchema()
        }
    }, [activeDb, selectedTable, activeTab, runQuery])

    const handleRunQuery = async (query: string) => {
        setQueryError(null)
        try {
            const res = await runQuery(query)
            setQueryResults(res)
        } catch (err) {
            setQueryError((err as Error).message)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            loadDbFromFile(file)
        }
    }

    if (databases.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <Database className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Database Loaded</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Open a SQLite database file to start exploring your data, or create a new empty one.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
                    >
                        <Upload className="w-5 h-5" />
                        Open Database
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".db,.sqlite,.sqlite3"
                        className="hidden"
                    />

                    <button
                        onClick={createEmptyDb}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Create New
                    </button>
                </div>
                {error && <p className="mt-4 text-destructive">{error}</p>}
            </div>
        )
    }

    return (
        <div className="flex h-full overflow-hidden relative">
            {/* Mobile Sidebar Toggle */}
            <button
                className="md:hidden absolute top-3 left-4 z-20 p-2 bg-card border border-border rounded-md shadow-sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <Database className="w-4 h-4" />
            </button>

            {/* DB Switcher Sidebar */}
            <div className={cn(
                "w-64 bg-card border-r border-border flex flex-col absolute md:relative h-full z-10 transition-transform duration-300",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold pl-8 md:pl-0">Databases</h2>
                    <div className="flex gap-1">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            title="Open Database"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                        <button
                            onClick={createEmptyDb}
                            className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            title="New Database"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".db,.sqlite,.sqlite3"
                        className="hidden"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {databases.map(db => (
                        <div
                            key={db.id}
                            className={cn(
                                "group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
                                activeDbId === db.id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => {
                                setActiveDb(db.id)
                                if (window.innerWidth < 768) setIsSidebarOpen(false)
                            }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Database className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate text-sm font-medium">{db.fileName}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); closeDb(db.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {activeDb ? (
                    <>
                        <div className="h-12 border-b border-border flex items-center px-4 gap-4 md:gap-6 bg-card/50 overflow-x-auto no-scrollbar">
                            <div className="w-8 md:hidden flex-shrink-0" /> {/* Spacer for toggle button */}
                            <button
                                onClick={() => setActiveTab("data")}
                                className={cn(
                                    "flex items-center gap-2 h-full border-b-2 px-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === "data" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Table className="w-4 h-4" />
                                Data
                            </button>
                            <button
                                onClick={() => setActiveTab("schema")}
                                className={cn(
                                    "flex items-center gap-2 h-full border-b-2 px-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === "schema" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Code className="w-4 h-4" />
                                Schema
                            </button>
                            <button
                                onClick={() => setActiveTab("query")}
                                className={cn(
                                    "flex items-center gap-2 h-full border-b-2 px-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === "query" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Code className="w-4 h-4" />
                                SQL Query
                            </button>
                            <button
                                onClick={() => setActiveTab("er")}
                                className={cn(
                                    "flex items-center gap-2 h-full border-b-2 px-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === "er" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <GitGraph className="w-4 h-4" />
                                Relationships
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            {activeTab === "data" && (
                                <div className="flex h-full">
                                    <TableList
                                        tables={activeDb.tables}
                                        selectedTable={selectedTable}
                                        onSelectTable={setSelectedTable}
                                        className="hidden md:flex"
                                    />
                                    <div className="flex-1 h-full overflow-hidden bg-background">
                                        {selectedTable ? (
                                            <DataGrid columns={dataResults.columns} values={dataResults.values} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
                                                Select a table from the sidebar to view data
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "query" && (
                                <div className="flex h-full">
                                    <TableList
                                        tables={activeDb.tables}
                                        selectedTable={selectedTable}
                                        onSelectTable={setSelectedTable}
                                        className="hidden md:flex"
                                    />
                                    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
                                        <div className="h-1/3 border-b border-border min-h-[200px]">
                                            <QueryEditor onRun={handleRunQuery} className="h-full" />
                                        </div>
                                        <div className="flex-1 overflow-hidden bg-background relative">
                                            {queryError ? (
                                                <div className="p-4 text-destructive">{queryError}</div>
                                            ) : (
                                                <div className="absolute inset-0">
                                                    <DataGrid columns={queryResults.columns} values={queryResults.values} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "schema" && (
                                <div className="flex h-full">
                                    <TableList
                                        tables={activeDb.tables}
                                        selectedTable={selectedTable}
                                        onSelectTable={setSelectedTable}
                                        className="hidden md:flex"
                                    />
                                    <div className="flex-1 h-full overflow-hidden bg-background p-4">
                                        {selectedTable ? (
                                            <div className="max-w-3xl h-full flex flex-col">
                                                <h3 className="text-lg font-bold mb-4">Schema: {selectedTable}</h3>
                                                <div className="flex-1 overflow-hidden border border-border rounded-lg">
                                                    <DataGrid columns={schemaResults.columns} values={schemaResults.values} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                Select a table to view schema
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "er" && (
                                <div className="h-full w-full">
                                    <ErDiagram />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a database from the sidebar
                    </div>
                )}
            </div>
        </div>
    )
}
