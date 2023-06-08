import { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
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
import dagre from 'dagre';

import Sidebar from './Sidebar';
import { convertJsonToFuncNodes } from './convertJsonToFuncNodes';
import { convertFuncNodeToJsonEdge, convertFuncNodeToJsonNode } from './convertFuncNodeToJson';
import NodeCreator from './NodeCreator';
import UploadDownload from './UploadDownload';
import { Dagger, changedDager, dd_dager } from '../../assets/SampleDag';
import CustomNode from './CustomNode';


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 75;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
    const isHorizontal = direction === 'TB';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: { id: any; }) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: { source: any; target: any; }) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: { id: any; targetPosition: string; sourcePosition: string; position: { x: number; y: number; }; }) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? 'left' : 'top';
        node.sourcePosition = isHorizontal ? 'right' : 'bottom';

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const getId = (type: string) => `${(type === 'input' || type === 'textUpdater') ? 'variable_' + Math.floor(Math.random() * 1000) : 'function_' + Math.floor(Math.random() * 1000)}`;
const nodeTypes = {
    // custom: (props: any) => <NodeCreator {...props} type='funcNode' />,
    textUpdater: (props: any) => <NodeCreator {...props} type='varNode' />,
    custom: (props: any) => <CustomNode {...props} type='funcNode' />,
};
export const DnDFlow = () => {


    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [isModal, setIsModal] = useState({ open: false, type: 'upload', data: {} });
    const [uploadOver, setUploadOver] = useState(false);

    // const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

    const onConnect = useCallback((params: Edge | Connection) => {
        const { source, target } = params;

        // Check if the source node already has an outgoing edge
        const existingEdge = edges.find((edge) => edge.source === source);

        if (existingEdge) {
            // An outgoing edge already exists, so prevent creating a new connection
            return;
        }
        const newEdge = {
            ...params,
            type: 'smoothstep',
            animated: true,
        };
        // No outgoing edge exists, create the new connection
        setEdges((prevEdges) => addEdge(newEdge, prevEdges));
    }, [edges]);

    const onLayout = useCallback(
        (direction: string | undefined) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                direction
            );
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges]
    );

    useEffect(() => {
        onLayout('TB'); // Set vertical layout on component load
    }, [uploadOver]);

    // const nodeTypes = useMemo(() => ({
    //     custom: (props: any) => <NodeCreator {...props} type='funcNode' />,
    //     textUpdater: (props: any) => <NodeCreator {...props} type='varNode'  />,
    // }), []);

    // const handleUpload = (data: any) => {
    //     const funcToJsonNode: any = convertFuncNodeToJsonNode(data);
    //     const funcToJsonEdge: any = convertFuncNodeToJsonEdge(data);
    //     setNodes(funcToJsonNode);
    //     setEdges(funcToJsonEdge);
    //     setUploadOver(true);
    // };

    const handleUpload = useCallback((data: any) => {
        const funcToJsonNode: any = convertFuncNodeToJsonNode(data);
        const funcToJsonEdge: any = convertFuncNodeToJsonEdge(data);
        setNodes(funcToJsonNode);
        setEdges(funcToJsonEdge);
        setUploadOver(!uploadOver);
    }, [setNodes, setEdges, setUploadOver]);

    const onSave = useCallback(() => {
        const flowKey = 'example-flow';
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            let MappedJson = {
                "name": "dag",
                func_nodes: convertJsonToFuncNodes(flow)
            };

            setIsModal({
                open: true,
                type: 'download',
                data: MappedJson
            });
            localStorage.setItem(flowKey, JSON.stringify(flow));
            localStorage.setItem('MappedJson', JSON.stringify(MappedJson));

        }
    }, [reactFlowInstance]);

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
                data: { label: '', initialEdge: 'right', },
            };
            if (type === 'custom') {
                newNode.data = {
                    label: 'Add',
                    ddType: 'Add',
                    initialEdge: 'right',
                    selects: {
                        [nodeTypeId]: 'Add',
                    },
                };
            }
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );


    const dataWithUpdates = nodes.map((node) => node);

    const isValidConnection = (connection: any) => {
        const { source, target } = connection;
        const sourceValid = nodes.find((node) => node.id === source)?.type;
        const targetValid = nodes.find((node) => node.id === target)?.type;
        return sourceValid !== targetValid;
        // return sourceValid !== 'custom' || targetValid !== 'custom';
    };

    const uploadHandler = () => {
        setUploadOver(false);
        setIsModal({
            open: true,
            type: 'upload',
            data: dd_dager
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
                        snapToGrid={true}
                        snapGrid={[2, 2]}
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
                            <button onClick={onSave} className='saveBtn panelBtn'>save</button>
                            <button onClick={uploadHandler} className='panelBtn'>Upload</button>
                        </Panel>

                        <Panel position="top-left">
                            <button onClick={() => onLayout('TB')} className='saveBtn'>vertical layout</button>
                            <button onClick={() => onLayout('LR')}>horizontal layout</button>
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

export default memo(DnDFlow)

