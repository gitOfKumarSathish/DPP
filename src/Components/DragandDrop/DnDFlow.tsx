import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Panel,
    Background,
    Connection,
    Edge,
    ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
import TextUpdaterNode from './TextUpdaterNode';


interface BackgroundProps {
    color: string;
    variant: 'dots' | 'squares' | 'lines'; // specify the allowed values
}

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input node' },
        position: { x: 250, y: 5 },
    },
];

let VarId = 0;
let funId = 0;
// const getId = (type: string) => `${type}_${id++}`;
const getId = (type: string) => `${type === 'input' ? 'variable_' + VarId++ : 'function_' + funId++}`;
// const getId = (type: string) => `${type}_${id++}`;

// `${type === 'input' ? 'variable' : 'function'} node` 

const BackgroundPattern: React.FC<BackgroundProps> = ({ color, variant }) => {
    return <div style={{ backgroundColor: color }} className={variant} />;
};

export const DnDFlower = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);


    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);


    const onSave = useCallback(() => {
        const flowKey = 'example-flow';
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            console.log('flow', flow);
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [reactFlowInstance]);

    const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const nodeTypeId = getId(type);
            const newNode = {
                id: nodeTypeId,
                type,
                position,
                // data: { label: `${type === 'input' ? 'variable' : 'function'} node` },
                data: { label: nodeTypeId },
                style: { background: '#fff', border: `1px solid ${type === 'input' ? '#0041d0' : 'green'}`, borderRadius: `${type === 'input' ? 0 : '10px'}`, fontSize: 12 },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    console.log('nodes', nodes);
    // const nodeTypes = {
    //     custom: CustomNode,
    //     textUpdater: TextUpdaterNode
    // };
    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <Sidebar />
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    // nodeTypes={nodeTypes}
                    >
                        <Background color="#ccc" variant='dots' />
                        <Controls />
                        <Panel position="top-right">
                            <button onClick={onSave}>save</button>
                        </Panel>
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};