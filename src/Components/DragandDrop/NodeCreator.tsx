import React, { useCallback, memo, useState, useEffect } from 'react';
import { Handle, useReactFlow, Position, useStoreApi } from 'reactflow';

function NodeCreator(props: any) {
    const { id, isConnectable, type } = props;
    console.log({ id, isConnectable, type });
    const [valueText, setValueText] = useState();
    const [nodeType, setNodeType] = useState({ title: 'func_node', label: 'func_label', placeHolder: 'function name' });
    const { setNodes } = useReactFlow();
    const store: any = useStoreApi();

    const labelNameChange = useCallback((evt: { target: { value: any; }; }) => {
        const { nodeInternals } = store.getState();
        setValueText(evt.target.value);
        setNodes(
            Array.from(nodeInternals.values()).map((node: any) => {
                if (node.id === id) {
                    node.data = {
                        ...node.data,
                        userInput: evt.target.value
                    };
                }
                return node;
            })
        );
    }, [props]);

    useEffect(() => {
        if (type !== 'funcNode') {
            setNodeType({ title: 'var_node', label: 'var_label', placeHolder: 'variable name' });
        }
    }, [props.type]);


    return (
        <div className="text-updater-node">
            <h4 className={`nodeTitle ${type}`}>{nodeType.title}</h4>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div className={`flexProps ${type}`}>
                <label htmlFor="text">{nodeType.label}:</label>
                <input id="text" name="text" onChange={labelNameChange} className="titleBox" placeholder={nodeType.placeHolder} value={valueText} />
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
}

export default memo(NodeCreator);

