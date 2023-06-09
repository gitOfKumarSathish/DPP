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

function Select({ value, handleId, nodeId }: any) {
  const { setNodes } = useReactFlow();
  const store = useStoreApi();

  const onChange = (evt: { target: { value: any; }; }) => {
    const { nodeInternals } = store.getState();
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
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
      {/* <div>Edge Type</div> */}
      <select className="nodrag" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Handle type="target" position={Position.Top} id={handleId} />
      <Handle type="source" position={Position.Bottom} id={handleId} />
    </div>
  );
}

function CustomNode({ id, data }: any) {
  return (
    <section className='dropdownArea'>
      <div className="custom-node__header">
        Function Type
      </div>
      <div className="custom-node__body">
        {Object.keys(data.selects).map((handleId, i) => (
          <>
            <Select key={i} nodeId={id} value={data.selects[handleId]} handleId={handleId} />
          </>
        ))}
      </div>
    </section>
  );
}

export default memo(CustomNode);