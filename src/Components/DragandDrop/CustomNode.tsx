import React, { memo, useCallback, useState } from 'react';
import { Handle, useReactFlow, useStoreApi, Position } from 'reactflow';

const options = [

  {
    value: 'Add',
    label: 'Add',
  },
  {
    value: 'Multiple',
    label: 'Multiple',
  },
  {
    value: 'Subtract',
    label: 'Subtract',
  },
  {
    value: 'Divide',
    label: 'Divide',
  },
  {
    value: 'new',
    label: 'New Function',
  }
];

function Select({ value, handleId, nodeId, sourcePosition }: any) {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();
  const [customValue, setCustomValue] = useState();

  const onChange = (evt: { target: { value: any; }; }) => {
    const { nodeInternals } = store.getState();
    setCustomValue(evt.target.value);
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            label: evt.target.value,
            ddType: evt.target.value,
            selects: {
              ...node.data.selects,
              [handleId]: evt.target.value,
            },
          };
        }
        return node;
      })
    );
  };

  const labelNameChange = useCallback((evt: { target: { value: any; }; }) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node: any) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            label: evt.target.value
          };
        }
        return node;
      })
    );
  }, []);

  return (
    <div className="custom-node__select">
      <select className="nodrag titleBox" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(customValue === 'new') &&
        <input id="text" name="text"
          onChange={labelNameChange}
          className="titleBox" />}

      <Handle type="target" position={sourcePosition === "right" ? Position.Top : Position.Left} id={handleId} />
      <Handle type="source" position={sourcePosition === "right" ? Position.Bottom : Position.Right} id={handleId} />
    </div>
  );
}

function CustomNode({ id, data, type, sourcePosition }: any) {
  return (
    <section className={`text-updater-node ${type}`}>
      <h4 className={`nodeTitle ${type}`}>func_node</h4>
      <div className={`flexProps ${type}`}>
        <Select nodeId={id} value={data.ddType === 'new' ? data.ddType : data.label} handleId={data.label} sourcePosition={sourcePosition} />
      </div>

    </section>
  );
}

export default memo(CustomNode);