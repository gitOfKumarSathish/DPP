export function convertFuncNodeToJsonNode(jsonData: any) {
    const { func_nodes } = jsonData;
    // console.log('func_nodes', func_nodes);
    let initialNodes: { id: any; type: string; data: { label: any; }; }[] = [];
    let varNodeCollection: any[] = [];
    let outNodeCollection: ((arg0: string, out: any) => unknown)[] = [];
    func_nodes.map((funcNode: {
        out(arg0: string, out: any): unknown;
        bind(arg0: string, bind: any): unknown; name: any; func_label: any;
    }, index: number) => {
        const funcObject = {
            id: funcNode.name,
            type: 'custom',
            data: {
                label: funcNode.func_label
            },
            position: { x: randomPosition() + index, y: randomPosition() + index },
        };
        initialNodes.push(funcObject);

        Object.values(funcNode.bind).map(varNode => {
            varNodeCollection.push(varNode);
            outNodeCollection.push(funcNode.out);
        });


        console.log('initialNodes', initialNodes);

    });

    const varNodes = [...new Set([...new Set(varNodeCollection)].concat([...new Set(outNodeCollection)]))];
    console.log('varNodes', varNodes);
    varNodes.map((varNode, index) => {
        const varObject = {
            id: varNode,
            type: 'textUpdater',
            data: {
                label: varNode
            },
            position: { x: randomPosition() + index, y: randomPosition() + index },
        };
        initialNodes.push(varObject);
    });

    return initialNodes;
}

export function randomPosition() {
    return Math.floor(Math.random() * 350);
}
export function convertFuncNodeToJsonEdge(jsonData: any) {
    const { func_nodes } = jsonData;
    let initialEdges: { id: string; markerEnd: { type: string; }; source: string; sourceHandle: string; target: string; targetHandle: null; }[] = [];
    // console.log('func_nodes', func_nodes);
    func_nodes.map((funcNode: {
        bind(bind: any): unknown; out: string; name: string;
    }) => {
        console.log('funcNode', funcNode);
        const edgeObject: any = {
            id: `${funcNode.out + "." + funcNode.name}_edge`,
            markerEnd: { type: 'arrowclosed' },
            source: funcNode.name,
            target: funcNode.out,
        };

        initialEdges.push(edgeObject);


        Object.values(funcNode.bind).map(varNode => {
            const edgeObject: any = {
                id: `${funcNode.out + "." + funcNode.name}_edge`,
                markerEnd: { type: 'arrowclosed' },
                source: varNode,
                target: funcNode.name,
            };

            initialEdges.push(edgeObject);
        });

    });

    return initialEdges;
}

// { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
// { id: 'e1-3', source: '1', target: '3', animated: true },

// id
// :
// "variable_0 + function_4";
// markerEnd
// :
// { type: 'arrowclosed'; }
// source
// :
// "variable_0";
// sourceHandle
// :
// "a";
// target
// :
// "function_4";
// targetHandle
// :
// null;