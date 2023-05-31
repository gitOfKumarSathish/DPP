import React from 'react';
import Graph from 'react-digraph';

const NODE_KEY = 'id';

export default class GraphViewer extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            nodes: [
                { id: 1, title: 'Node 1', x: 258.3976135253906, y: 331.9783248901367 },
                { id: 2, title: 'Node 2', x: 593.9393920898438, y: 260.6060791015625 }
            ],
            edges: [
                { source: 1, target: 2 }
            ]
        };
        this.handleNodePositionChange = this.handleNodePositionChange.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
    }

    render() {
        const { nodes, edges } = this.state;
        const selected = null;
        const NodeTypes = GraphConfig.NodeTypes;
        const NodeSubtypes = GraphConfig.NodeSubtypes;
        const EdgeTypes = GraphConfig.EdgeTypes;

        return (
            <div id='graph' style={{ height: '100%', width: '100%' }}>
                <Graph
                    id='graph-id' // id is mandatory, if no id is defined rd3g will throw an error
                    data={{ nodes, edges }}
                    selected={selected}
                    nodeTypes={NodeTypes}
                    nodeSubtypes={NodeSubtypes}
                    edgeTypes={EdgeTypes}
                    onNodePositionChange={this.handleNodePositionChange}
                    onSelectionChange={this.handleSelectionChange}
                />
            </div>
        );
    }

    handleNodePositionChange(nodeId: any, x: number, y: number) {
        const { nodes } = this.state;
        const dx = x - nodes.find((n: { [x: string]: any; }) => n[NODE_KEY] === nodeId).x;
        const dy = y - nodes.find((n: { [x: string]: any; }) => n[NODE_KEY] === nodeId).y;
        const newNodes = nodes.map((n: { [x: string]: any; x: number; y: number; }) => {
            if (n[NODE_KEY] === nodeId) {
                return { ...n, x, y };
            }
            return { ...n, x: n.x + dx, y: n.y + dy };
        });
        this.setState({ nodes: newNodes });
    }

    handleSelectionChange(newSelection: any) {
        console.log('Selection change', newSelection);
    }
}

// export default GraphView;
