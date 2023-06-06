import React, { memo } from 'react';
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
  }
];

function Select({ value, handleId, nodeId, sourcePosition }: any) {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const onChange = (evt: { target: { value: any; }; }) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            label: evt.target.value,
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

  return (
    <div className="custom-node__select">
      <select className="nodrag titleBox" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
        <Select nodeId={id} value={data.label} handleId={data.label} sourcePosition={sourcePosition} />
        {/* {Object.keys(data.selects).map((handleId, i) => (
          <>
            <Select key={i} nodeId={id} value={data.selects[handleId]} handleId={handleId} />
          </>
        ))} */}
      </div>
    </section>
  );
}

export default memo(CustomNode);