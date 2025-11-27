import { Play, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"

interface QueryEditorProps {
    initialQuery?: string
    onRun: (query: string) => void
    className?: string
}

export default function QueryEditor({ initialQuery = "", onRun, className }: QueryEditorProps) {
    const [query, setQuery] = useState(initialQuery)

    useEffect(() => {
        if (initialQuery) setQuery(initialQuery)
    }, [initialQuery])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            onRun(query)
        }
    }

    return (
        <div className={className}>
            <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card">
                <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/30">
                    <span className="text-xs font-medium text-muted-foreground px-2">SQL Editor</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setQuery("")}
                            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="Clear"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onRun(query)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                            title="Run Query (Ctrl+Enter)"
                        >
                            <Play className="w-4 h-4" />
                            Run
                        </button>
                    </div>
                </div>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 w-full p-4 font-mono text-sm bg-background text-foreground resize-none focus:outline-none"
                    placeholder="SELECT * FROM table..."
                    spellCheck={false}
                />
            </div>
        </div>
    )
}
