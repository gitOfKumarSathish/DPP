import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      {/* <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Variable Node
      </div>
      <div className="dndnode function" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        function Node
      </div> */}
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'textUpdater')} draggable>
        Variable Node
      </div>
      <div className="dndnode function" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
        Function Node
      </div>


      {/* <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div> */}
    </aside>
  );
};
