import { useState, useRef, useCallback } from 'react';
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
    applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import CustomNode from './CustomNode';
import TextUpdaterNode from './TextUpdaterNode';

let VarId = 0;
let funId = 0;

const getId = (type: string) => `${((type === 'input' || type === 'textUpdater') || type === 'textUpdater') ? 'variable_' + VarId++ : 'function_' + funId++}`;
const nodeTypes = {
    custom: CustomNode,
    textUpdater: TextUpdaterNode
    // textUpdater: (props: any) => <TextUpdaterNode {...props} />
};
export const DnDFlower = () => {


    // const nodeTypes = useMemo(() => ({
    //     custom: CustomNode,
    //     textUpdater: TextUpdaterNode
    //     // textUpdater: (props: any) => <TextUpdaterNode {...props} />
    // }), []);


    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

    const onSave = useCallback(() => {
        const flowKey = 'example-flow';
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [reactFlowInstance]);

    const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const edgesWithUpdatedTypes = edges.map((edge) => {
        console.log('edge.sourceHandle', edge.sourceHandle, edge.data);
        if (edge.sourceHandle) {
            const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
            edge.type = edgeType;
        }

        return edge;
    });

    const dataWithUpdates = nodes.map((node) => {
        console.log('Main node', node);
        // if (node.type === "textUpdater") {
        //     node.data = {
        //         ...node.data,
        //         value
        //     };
        // }
        if (node.type === "custom") {
            // const check = node.data;
            // console.log('object');
            // console.log('check', Object.values(check.selects));
            // node.data = {
            //     ...node.data,
            //     fnType: Object.values(check.selects)
            // };
        }
        return node;
    });
    const onDrop = useCallback(
        (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const nodeTypeId = getId(type);
            let newNode: any = {
                id: nodeTypeId,
                type,
                position,
                data: { label: nodeTypeId, value: '' },
                style: { background: '#fff', border: `1px solid ${(type === 'input' || type === 'textUpdater') ? '#0041d0' : 'green'}`, borderRadius: `${(type === 'input' || type === 'textUpdater') ? 0 : '10px'}`, fontSize: 12 },
            };
            if (type === 'custom') {
                newNode.data = {
                    label: nodeTypeId, selects: {
                        'handle-0': 'smoothstep',
                    },
                };
            }

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <Sidebar />
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        // nodes={nodes}
                        nodes={dataWithUpdates}

                        // edges={edges}
                        edges={edgesWithUpdatedTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        nodeTypes={nodeTypes}
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

