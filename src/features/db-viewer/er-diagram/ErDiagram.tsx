import { useEffect, useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import { useDbStore } from '../db-store'
import TableNode from './TableNode'
import { extractSchema } from './utils'
import { useTheme } from '../../../lib/theme'

function ErDiagramContent() {
    const { getActiveDb } = useDbStore()
    const activeDb = getActiveDb()
    const { theme } = useTheme()

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const nodeTypes = useMemo(() => ({ table: TableNode }), [])

    useEffect(() => {
        if (activeDb?.db) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = extractSchema(activeDb.db)
            setNodes(layoutedNodes)
            setEdges(layoutedEdges)
        }
    }, [activeDb, setNodes, setEdges])

    if (!activeDb) return null

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color={theme === 'dark' ? '#333' : '#ddd'} gap={16} />
                <Controls className="bg-card border border-border text-foreground fill-foreground" />
                <MiniMap
                    className="bg-card border border-border"
                    maskColor={theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}
                    nodeColor={theme === 'dark' ? '#38bdf8' : '#0f172a'}
                />
            </ReactFlow>
        </div>
    )
}

export default function ErDiagram() {
    return (
        <ReactFlowProvider>
            <ErDiagramContent />
        </ReactFlowProvider>
    )
}
