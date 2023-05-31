import React from 'react';
import ReactFlow from 'reactflow';
import { shallow } from 'zustand/shallow';

import 'reactflow/dist/style.css';

import useStore from './Store';

const selector = (state: { nodes: any; edges: any; onNodesChange: any; onEdgesChange: any; onConnect: any; }) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});

function StoreFlow() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        />
    );
}

export default StoreFlow;
