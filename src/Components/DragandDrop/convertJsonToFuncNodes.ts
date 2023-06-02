export function convertJsonToFuncNodes(jsonData: any) {

    const { edges, nodes } = jsonData;
    console.log('nodes', nodes);
    console.log('edges', edges);

    let funcNode = nodes.filter((node: { type: string; }) => node.type === "custom");
    let varNode = nodes.filter((node: { type: string; }) => node.type !== "custom");
    console.log('objects', funcNode);
    console.log('varNode', varNode);
    let mapping: any[] = [];
    funcNode.forEach((node: { id: any; data: { userInput: any; }; }) => {
        let eachObject: any = {};
        eachObject['name'] = node.id;
        eachObject['func_label'] = node.data.userInput;
        console.log('node', node);
        let cc = {};
        edges.map((x: { id: string | any[]; target: any; source: any; }) => {
            if (x.id.includes(node.id) && x.target === node.id) {
                varNode.map((vars: { id: string | any[]; data: { userInput: any; }; }) => {
                    if (vars.id.includes(x.source)) {
                        console.log('vars', vars);
                        Object.assign(cc, { [vars.data.userInput]: vars.data.userInput });
                    }
                });
            }
            eachObject['bind'] = cc;
        });

        mapping.push(eachObject);
        console.log('eachObject', eachObject);
    });
    console.log('mapping', mapping);


    // const funcNodes = nodes.filter((node: { type: string; }) => node.type === "custom").map((node: {
    //     id: any; data: { selects: any; label: any; }; type: string;
    // }) => ({
    //     name: node.id,
    //     func_label: node.data.label,
    //     // checker: edges.filter((edge: { target: any; }) => edge.target === node.id && node.type === "custom").reduce((acc: any, edge: { source: any; }) => console.log('edge', edge)),
    //     bind: edges.filter((edge: { target: any; }) => edge.target === node.id && node.type === "custom").reduce((acc: any, edge: { source: any; }) => (
    //         { ...acc, [edge.source]: edge.source }), {}),
    //     out: edges.filter((edge: { source: any; }) => edge.source === node.id && node.type === "custom").map((edge: { target: any; id: any; }) => edge.target),
    //     edgeOut: edges.filter((edge: { source: any; }) => edge.source === node.id && node.type === "custom").map((edge: { target: any; id: any; }) => console.log('edge', edge, node))
    // }));

    // console.log("funcNodes", funcNodes);

    // return funcNodes;



    // const funcNodes = [];
    // let eachObject: any = {};
    // for (const node of nodes) {
    //     if (node.type === "custom") {
    //         eachObject['name'] = node.id;
    //         eachObject['func_label'] = node.data.label;
    //     }

    // }

    // for (const node of nodes) {
    //     let bindObject: any = {};
    //     for (const edge of edges) {
    //         if (node.id === edge.source && node.type !== "custom") {
    //             console.log('custom node', node);
    //             console.log('edges', edge);
    //             console.log('node.data.userInput', node.data.userInput);
    //             bindObject = Object.assign(bindObject, { [node.data.userInput]: node.data.userInput });
    //         }
    //     }
    //     eachObject.bind = bindObject;
    //     console.log('bindObject', bindObject);
    // }


    // if (Object.keys(eachObject).length > 0) {
    //     funcNodes.push(eachObject);
    // }
    // console.log('funcNodes', funcNodes);
    // return funcNodes;
}


// for (const edge of edges) {
//     if (node.id === edge.source && node.type !== "custom") {
//         console.log('custom node', node);
//         console.log('edges', edge);
//         go.push(node.data.userInput);

//     }
//     eachObject['bind'] = go.map(x => Object.assign({}, { [x]: x }));
// }


// let edgeParams = {};
// for (const edge of edges) {
//     if (edge.target === node.id && node.type === "custom") {
//         edgeParams = { ...edgeParams, [edge.source]: edge.source };
//         eachObject['bind'] = edgeParams;
//     }
//     if (edge.target === node.id && node.type !== "custom") {
//         console.log('edges', edge, node.id);
//         eachObject['out'] = node.id;
//     }
// }