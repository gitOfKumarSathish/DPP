import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 20 };

function TextUpdaterNode(props: any) {

    const onChange = useCallback((evt) => {
        const newText = evt.target.value;
        console.log(newText);
        if (props.onChange) {
            props.onChange(newText);
        }
    }, [props]);

    return (
        <div className="text-updater-node">
            {/* <Handle type="target" position={Position.Top} isConnectable={props.isConnectable} /> */}
            <div>
                {/* <label htmlFor="text">Text:</label> */}
                <input id="text" name="text" onChange={onChange} className="nodrag customInputBox" />
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                // style={handleStyle}
                isConnectable={props.isConnectable}
            />
            {/* <Handle type="source" position={Position.Bottom} id="b" isConnectable={props.isConnectable} /> */}
        </div>
    );
}

export default TextUpdaterNode;
