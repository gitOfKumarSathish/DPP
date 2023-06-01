import { useCallback, memo } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

const handleStyle = { left: 20 };

function TextUpdaterNode(props: any) {
    const { id, isConnectable } = props;
    const { setNodes } = useReactFlow();
    const store = useStoreApi();

    const onChange = useCallback((evt: { target: { value: any; }; }) => {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        value: evt.target.value
                    };
                }
                return node;
            })
        );
    }, [props]);

    return (
        <div className="text-updater-node">
            {/* <Handle type="target" position={Position.Top} isConnectable={isConnectable} /> */}
            <div>
                {/* <label htmlFor="text">Text:</label> */}
                <input id="text" name="text" onChange={onChange} className="nodrag customInputBox" />
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                // style={handleStyle}
                isConnectable={isConnectable}
            />
            {/* <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} /> */}
        </div>
    );
}

export default memo(TextUpdaterNode);
