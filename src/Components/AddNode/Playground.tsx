import { useCallback } from 'react';
import ReactFlow, { ReactFlowProvider, useReactFlow, Background, Panel, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// import defaultNodes from './nodes.js';
// import defaultEdges from './edges.js';

// import './button.css';

const edgeOptions = {
    animated: true,
    style: {
        stroke: 'white',
    },
};

const connectionLineStyle = { stroke: 'white' };

let nodeId = 0;

function Flow() {
    const reactFlowInstance = useReactFlow();
    const onClick = useCallback(() => {
        const id = `${++nodeId}`;
        const newNode = {
            id,
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500,
            },
            data: {
                label: `Node ${id}`,
            },
        };
        reactFlowInstance.addNodes(newNode);
    }, []);


    const defaultNodes = [
        {
            id: 'a',
            type: 'input',
            data: { label: 'Node A' },
            position: { x: 250, y: 25 },
        },

        {
            id: 'b',
            data: { label: 'Node B' },
            position: { x: 100, y: 125 },
        },
        {
            id: 'c',
            type: 'output',
            data: { label: 'Node C' },
            position: { x: 250, y: 250 },
        },
    ];

    const defaultEdges = [{ id: 'ea-b', source: 'a', target: 'b' }];
    const proOptions = { hideAttribution: false };

    return (
        <>
            <ReactFlow
                defaultNodes={defaultNodes}
                defaultEdges={defaultEdges}
                defaultEdgeOptions={edgeOptions}
                fitView
                style={{
                    backgroundColor: '#CCCCCC',
                }}
                proOptions={proOptions}
                connectionLineStyle={connectionLineStyle}
            ><Background color="#ccc" variant='dots' />
                <Controls />
            </ReactFlow>
            <button onClick={onClick} className="btn-add">
                add node
            </button>
        </>
    );
}

export default function () {
    return (
        <ReactFlowProvider>
            <Flow />
        </ReactFlowProvider>
    );
}
