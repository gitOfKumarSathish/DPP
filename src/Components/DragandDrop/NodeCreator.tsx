import React, { useCallback, memo, useState, useEffect } from 'react';
import { Handle, useReactFlow, Position, useStoreApi } from 'reactflow';
import { pythonIdentifierPattern } from '../Utilities/globalFunction';

function NodeCreator(props: any) {
    const { id, isConnectable, type, sourcePosition, data } = props;
    const [valueText, setValueText] = useState(props.data.label);
    const [nodeType, setNodeType] = useState({ title: 'func_node', label: 'func_label', placeHolder: 'function name' });
    const [validationMsg, setValidationMsg] = useState(false);
    const { setNodes } = useReactFlow();
    const store: any = useStoreApi();

    const labelNameChange = useCallback((evt: { target: { value: any; }; }) => {
        const { nodeInternals } = store.getState();
        const inputValue = evt.target.value;
        if (pythonIdentifierPattern.test(inputValue)) {
            setValidationMsg(false);
            setValueText(inputValue);
            setNodes(
                Array.from(nodeInternals.values()).map((node: any) => {
                    if (node.id === id) {
                        node.data = {
                            ...node.data,
                            label: inputValue
                        };
                    }
                    return node;
                })
            );
        } else {
            console.log("Invalid identifier");
            setValidationMsg(true);
        }

    }, [props]);

    useEffect(() => {
        if (type !== 'funcNode') {
            setNodeType({ title: 'var_node', label: 'var_label', placeHolder: 'variable name' });
        }
    }, [props.type]);

    return (
        <div className="text-updater-node">
            <h4 className={`nodeTitle ${type}`}>{nodeType.title}</h4>
            <Handle type="target" position={data?.initialEdge === 'right' || sourcePosition === "right" ? Position.Top : Position.Left} isConnectable={isConnectable} />
            <div className={`flexProps ${type}`}>


                <div className="inputStyler">
                    <label htmlFor="text">{nodeType.label}:</label>
                    <input id="text" name="text" onChange={labelNameChange} className="titleBox" placeholder={nodeType.placeHolder} value={valueText} />
                </div>
                {validationMsg && <span className='invalidMsg'>Invalid Entry</span>}

            </div>


            <Handle type="source" position={data?.initialEdge === 'right' || sourcePosition === "right" ? Position.Bottom : Position.Right} isConnectable={isConnectable} />
        </div>
    );
}

export default memo(NodeCreator);



// sourcePosition = right => vertical
// sourcePosition = bottom => horizontal 