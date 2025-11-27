import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface DataGridProps {
    columns: string[]
    values: any[][]
    className?: string
}

export default function DataGrid({ columns, values, className }: DataGridProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [sortCol, setSortCol] = useState<number | null>(null)
    const [sortAsc, setSortAsc] = useState(true)
    const [filter, setFilter] = useState("")

    const filteredValues = useMemo(() => {
        if (!filter) return values
        const lowerFilter = filter.toLowerCase()
        return values.filter(row =>
            row.some(cell => String(cell).toLowerCase().includes(lowerFilter))
        )
    }, [values, filter])

    const sortedValues = useMemo(() => {
        if (sortCol === null) return filteredValues
        return [...filteredValues].sort((a, b) => {
            const valA = a[sortCol]
            const valB = b[sortCol]
            if (valA === valB) return 0
            const comparison = valA > valB ? 1 : -1
            return sortAsc ? comparison : -comparison
        })
    }, [filteredValues, sortCol, sortAsc])

    const totalPages = Math.ceil(sortedValues.length / pageSize)
    const paginatedValues = sortedValues.slice((page - 1) * pageSize, page * pageSize)

    const handleSort = (colIndex: number) => {
        if (sortCol === colIndex) {
            setSortAsc(!sortAsc)
        } else {
            setSortCol(colIndex)
            setSortAsc(true)
        }
    }

    if (columns.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No data to display</div>
    }

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center justify-between p-2 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Filter data..."
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                        className="px-3 py-1.5 rounded-md border border-input bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                        {sortedValues.length} rows
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="px-2 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value={10}>10 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                        <option value={500}>500 per page</option>
                    </select>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 rounded hover:bg-secondary disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm min-w-[3rem] text-center">
                            {page} / {Math.max(1, totalPages)}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="p-1 rounded hover:bg-secondary disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground sticky top-0 z-10">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 border-b border-border font-medium cursor-pointer hover:bg-secondary transition-colors whitespace-nowrap"
                                    onClick={() => handleSort(i)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col}
                                        <ArrowUpDown className={cn("w-3 h-3", sortCol === i ? "opacity-100" : "opacity-30")} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedValues.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-border hover:bg-secondary/20 transition-colors"
                            >
                                {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis" title={String(cell)}>
                                        {cell === null ? <span className="text-muted-foreground italic">null</span> : String(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
