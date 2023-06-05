import { useState, useRef, useCallback, useEffect } from 'react';
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
    MarkerType,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import { convertJsonToFuncNodes } from './convertJsonToFuncNodes';
import { convertFuncNodeToJsonEdge, convertFuncNodeToJsonNode } from './convertFuncNodeToJson';
import NodeCreator from './NodeCreator';
import UploadDownload from './UploadDownload';



const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input node' },
        position: { x: 250, y: 5 },
    },
];


const getId = (type: string) => `${(type === 'input' || type === 'textUpdater') ? 'variable_' + Math.floor(Math.random() * 1000) : 'function_' + Math.floor(Math.random() * 1000)}`;
const nodeTypes = {
    custom: (props: any) => <NodeCreator {...props} type='funcNode' />,
    textUpdater: (props: any) => <NodeCreator {...props} type='varNode' />,
};
export const DnDFlower = () => {

    const funcToJsonNode: any = [];
    const funcToJsonEdge: any = [];

    // const nodeTypes = useMemo(() => ({
    //     custom: CustomNode,
    //     textUpdater: TextUpdaterNode
    //     // textUpdater: (props: any) => <TextUpdaterNode {...props} />
    // }), []);


    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(funcToJsonNode || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(funcToJsonEdge || []);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [isModal, setIsModal] = useState({ open: false, type: 'upload', data: {} });

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

    const handleUpload = (data: any) => {
        const funcToJsonNode: any = convertFuncNodeToJsonNode(data);
        const funcToJsonEdge: any = convertFuncNodeToJsonEdge(data);
        setNodes(funcToJsonNode);
        setEdges(funcToJsonEdge);
        console.log('funcToJson', funcToJsonNode);
        console.log('funcToJsonEdge', funcToJsonEdge);
    };

    const onSave = useCallback(() => {
        const flowKey = 'example-flow';
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            console.log('flow', flow);
            const check = convertJsonToFuncNodes(flow);
            console.log('check', check);
            let MappedJson = {
                "name": "dag",
                func_nodes: check
            };

            setIsModal({
                open: true,
                type: 'download',
                data: MappedJson
            });
            // console.log('MappedJson', MappedJson);
            // console.log('check', check);
            localStorage.setItem(flowKey, JSON.stringify(flow));
            localStorage.setItem('MappedJson', JSON.stringify(MappedJson));

        }
    }, [reactFlowInstance, nodes]);

    const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const edgesWithUpdatedTypes = edges.map((edge: any) => {
        if (edge.sourceHandle) {
            // const edgeType = nodes.find((node) => node.type === 'custom')?.data.selects[edge.sourceHandle];
            // edge.type = edgeType;
            edge.markerEnd = {
                type: MarkerType.ArrowClosed,
            };
        } edge.id = `${edge.source} + ${edge.target}`;
        // console.log('edge', edge);
        return edge;
    });

    const onDrop = useCallback(
        (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }
            const position = reactFlowInstance?.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const nodeTypeId = getId(type);
            let newNode: any = {
                id: nodeTypeId,
                type,
                position,
                data: { label: '' },
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    useEffect(() => {
        // Update the position of the nodes
        for (let i = 0; i < nodes.length; i++) {
            console.log('nodes[i]', nodes[i]);
            // position: { x: 250, y: 5 },
            nodes[i].position.x = i * 100;
            nodes[i].position.y = i * 100;
        }
    }, [nodes]);


    const dataWithUpdates = nodes.map((node) => {
        // console.log('Main node', node);
        // edges.map((edge) => {
        //     console.log('edge', edge);
        // });
        return node;
    });

    const isValidConnection = (connection: any) => {
        const { source, target } = connection;
        const sourceValid = nodes.find((node) => node.id === source)?.type;
        const targetValid = nodes.find((node) => node.id === target)?.type;
        return sourceValid !== 'custom' || targetValid !== 'custom';
    };

    const uploadHandler = () => {
        setIsModal({
            open: true,
            type: 'upload',
            data: {
                "name": "dag",
                "func_nodes": [
                    {
                        "name": "function_0",
                        "func_label": "add",
                        "bind": {
                            "1": "1",
                            "2": "2"
                        },
                        "out": "4"
                    },
                    {
                        "name": "function_1",
                        "func_label": "mul",
                        "bind": {
                            "2": "2",
                            "3": "3"
                        },
                        "out": "5"
                    }
                ]
            }
        });
    };

    const closeModal = () => {
        setIsModal({
            open: false,
            type: 'upload',
            data: {}
        });
    };



    return (
        <div className={`dndflow ${isModal?.open && 'overlayEffect'}`}>
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
                        isValidConnection={isValidConnection}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        nodeTypes={nodeTypes}
                    >
                        {/* <Background color="#ccc" variant={BackgroundVariant.Dots} /> */}
                        <Background
                            variant={BackgroundVariant.Lines}
                            color="#2a2b2d"
                            style={{ backgroundColor: "#1E1F22" }}
                        />
                        <Controls />
                        <Panel position="top-right">
                            <button onClick={onSave}>save</button>
                            <button onClick={uploadHandler}>Upload</button>
                        </Panel>
                    </ReactFlow>
                </div>

            </ReactFlowProvider>

            {isModal?.open && (
                <div className='overlayPosition'>
                    <UploadDownload onClose={closeModal} type={isModal?.type} data={isModal?.data} onDataUploaded={handleUpload} />
                </div>
            )}



        </div>

    );


};

