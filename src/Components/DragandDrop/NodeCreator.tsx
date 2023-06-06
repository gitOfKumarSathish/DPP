import React, { useCallback, memo, useState, useEffect } from 'react';
import { Handle, useReactFlow, Position, useStoreApi } from 'reactflow';

function NodeCreator(props: any) {
    console.log('props', props);
    const { id, isConnectable, type, sourcePosition } = props;
    const [valueText, setValueText] = useState(props.data.label);
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
                        label: evt.target.value
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

    { console.log('layout nide creator', sourcePosition); }
    return (
        <div className="text-updater-node">
            <h4 className={`nodeTitle ${type}`}>{nodeType.title}</h4>
            <Handle type="target" position={sourcePosition === "right" ? Position.Top : Position.Left} isConnectable={isConnectable} />
            <div className={`flexProps ${type}`}>
                <label htmlFor="text">{nodeType.label}:</label>
                <input id="text" name="text" onChange={labelNameChange} className="titleBox" placeholder={nodeType.placeHolder} value={valueText} />
            </div>
            <Handle type="source" position={sourcePosition === "right" ? Position.Bottom : Position.Right} isConnectable={isConnectable} />
        </div>
    );
}

export default memo(NodeCreator);

