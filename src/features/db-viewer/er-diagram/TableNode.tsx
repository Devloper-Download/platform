import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { KeyRound, Columns } from 'lucide-react'

export type TableNodeData = {
    label: string
    columns: { name: string, type: string, isPk: boolean, isFk: boolean }[]
}

const TableNode = ({ data }: NodeProps<TableNodeData>) => {
    return (
        <div className="bg-card border border-border rounded-lg shadow-sm min-w-[200px] overflow-hidden">
            <div className="bg-secondary/50 px-3 py-2 border-b border-border flex items-center gap-2">
                <Columns className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{data.label}</span>
            </div>
            <div className="p-2 space-y-1">
                {data.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between text-xs px-1 py-0.5 hover:bg-secondary/30 rounded">
                        <div className="flex items-center gap-2">
                            {col.isPk && <KeyRound className="w-3 h-3 text-amber-500" />}
                            <span className={col.isPk ? "font-medium" : ""}>{col.name}</span>
                        </div>
                        <span className="text-muted-foreground text-[10px]">{col.type}</span>
                        <Handle type="source" position={Position.Right} id={col.name} className="!bg-primary/50 !w-2 !h-2" />
                        <Handle type="target" position={Position.Left} id={col.name} className="!bg-primary/50 !w-2 !h-2" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(TableNode)
