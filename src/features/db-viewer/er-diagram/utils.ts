import dagre from 'dagre'
import { type Node, type Edge, Position } from 'reactflow'
import type { Database } from 'sql.js'
import { executeQuery } from '../../../lib/sqlite'

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const nodeWidth = 250
    const nodeHeight = 300

    // Switch to TB (Top-Bottom) layout for better horizontal spread
    dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 100 })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        node.targetPosition = Position.Top
        node.sourcePosition = Position.Bottom
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        }
    })

    return { nodes, edges }
}

export const extractSchema = (db: Database) => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Get all tables
    const tablesRes = executeQuery(db, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    const tables = tablesRes.values.flat() as string[]

    tables.forEach(table => {
        // Get columns info
        const colsRes = executeQuery(db, `PRAGMA table_info('${table}')`)
        const columns = colsRes.values.map((row: any) => ({
            name: row[1],
            type: row[2],
            isPk: row[5] === 1,
            isFk: false // Will update later
        }))

        // Get FKs
        const fkRes = executeQuery(db, `PRAGMA foreign_key_list('${table}')`)
        fkRes.values.forEach((row: any) => {
            const fromCol = row[3]
            const toTable = row[2]
            const toCol = row[4]

            // Mark column as FK
            const col = columns.find(c => c.name === fromCol)
            if (col) col.isFk = true

            edges.push({
                id: `${table}-${fromCol}-${toTable}-${toCol}`,
                source: table,
                target: toTable,
                sourceHandle: fromCol,
                targetHandle: toCol,
                animated: true,
                style: { stroke: 'hsl(var(--primary))' },
            })
        })

        nodes.push({
            id: table,
            type: 'table',
            data: { label: table, columns },
            position: { x: 0, y: 0 }
        })
    })

    return getLayoutedElements(nodes, edges)
}
