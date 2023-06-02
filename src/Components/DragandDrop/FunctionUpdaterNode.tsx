import { useCallback, memo, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

const handleStyle = { left: 20 };

function FunctionUpdaterNode(props: any) {
    const { id, isConnectable } = props;
    const [valueText, setValueText] = useState(props.data.label);
    const { setNodes } = useReactFlow();
    const store = useStoreApi();

    const onChange = useCallback((evt: { target: { value: any; }; }) => {
        const { nodeInternals } = store.getState();
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        value: valueText
                    };
                }
                return node;
            })
        );
    }, [props]);

    const labelNameChange = useCallback((evt: { target: { value: any; }; }) => {
        const { nodeInternals } = store.getState();
        setValueText(evt.target.value);
        setNodes(
            Array.from(nodeInternals.values()).map((node) => {
                if (node.id === id) {
                    console.log('node.id changed', node);
                    node.data = {
                        ...node.data,
                        userInput: evt.target.value
                    };
                }
                return node;
            })
        );
    }, [props]);

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                {/* <label htmlFor="text">Text:</label> */}
                <input id="text" name="text" onChange={labelNameChange} className="titleBox" placeholder='Function name' value={valueText} />
                {/* <hr /> */}
                {/* <input id="text" name="text" onChange={onChange} className="nodrag customInputBox" placeholder='variable value' /> */}
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

export default memo(FunctionUpdaterNode);
