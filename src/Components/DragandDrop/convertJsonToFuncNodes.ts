export function convertJsonToFuncNodes(jsonData: any): Array<{
    name: string;
    funcLabel: string;
    bind: {
        fpr: string;
        n: string;
    };
    out: string;
}> {

    const { edges, nodes } = jsonData;
    console.log('nodes', nodes);
    const funcNodes = nodes.filter((node: { type: string; }) => node.type === "custom").map((node: { id: any; data: { label: any; }; type: string; }) => ({
        name: node.id,
        func_label: node.data.label,
        // checker: edges.filter((edge: { target: any; }) => edge.target === node.id && node.type === "custom").reduce((acc: any, edge: { source: any; }) => console.log('edge', edge)),
        bind: edges.filter((edge: { target: any; }) => edge.target === node.id && node.type === "custom").reduce((acc: any, edge: { source: any; }) => (
            { ...acc, [edge.source]: edge.source }), {}),
        out: edges.filter((edge: { source: any; }) => edge.source === node.id && node.type === "custom").map((edge: { target: any; id: any; }) => edge.target)
    }));

    console.log("funcNodes", funcNodes);

    return funcNodes;



    // const funcNodes = [];
    // for (const node of nodes) {
    //     const eachObject: any = {};
    //     console.log('node', node);

    //     if (node.type === "custom") {
    //         eachObject['name'] = node.id;
    //         eachObject['func_label'] = node.data.label;
    //     }
    //     let edgeParams = {};
    //     for (const edge of edges) {
    //         if (edge.target === node.id && node.type === "custom") {
    //             edgeParams = { ...edgeParams, [edge.source]: edge.source };
    //             eachObject['bind'] = edgeParams;
    //         }
    //         if (edge.target === node.id && node.type !== "custom") {
    //             console.log('edges', edge, node.id);
    //             eachObject['out'] = node.id;
    //         }
    //     }
    //     if (Object.keys(eachObject).length > 0) {
    //         funcNodes.push(eachObject);
    //     }
    // }
    // console.log('funcNodes', funcNodes);
    // return funcNodes;
}