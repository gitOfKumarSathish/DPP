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
    MarkerType,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import { convertJsonToFuncNodes } from './convertJsonToFuncNodes';
import { Dagger } from '../../assets/SampleDag';
import { convertFuncNodeToJsonEdge, convertFuncNodeToJsonNode } from './convertFuncNodeToJson';
import NodeCreator from './NodeCreator';
import UploadJson from './UploadJson';



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

const getId = (type: string) => `${(type === 'input' || type === 'textUpdater') ? 'variable_' + VarId++ : 'function_' + funId++}`;
const nodeTypes = {
    custom: (props: any) => <NodeCreator {...props} type='funcNode' />,
    textUpdater: (props: any) => <NodeCreator {...props} type='varNode' />,
};
export const DnDFlower = () => {

    // const funcToJsonNode: any = convertFuncNodeToJsonNode(Dagger);
    // const funcToJsonEdge: any = convertFuncNodeToJsonEdge(Dagger);
    // console.log('funcToJson', funcToJsonNode);

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

    const onSave = useCallback(() => {
        const flowKey = 'example-flow';
        if (reactFlowInstance) {

            const flow = reactFlowInstance.toObject();
            const check = convertJsonToFuncNodes(flow);
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
                data: { label: nodeTypeId },
                style: customStyle(),
            };
            setNodes((nds) => nds.concat(newNode));
            function customStyle() {
                return { background: '#1f2937', fontSize: 12, color: '#fff' };
            }
        },
        [reactFlowInstance]
    );


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
            data: {}
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
                    <UploadJson onClose={closeModal} type={isModal?.type} data={isModal?.data} />
                </div>
            )}



        </div>

    );


};

