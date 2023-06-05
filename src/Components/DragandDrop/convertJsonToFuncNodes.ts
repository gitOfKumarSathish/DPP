export function convertJsonToFuncNodes(jsonData: any) {
    const { edges, nodes } = jsonData;
    let funcNodes = nodes.filter((node: { type: string; }) => node.type === "custom");
    let varNodes = nodes.filter((node: { type: string; }) => node.type !== "custom");
    let mapping: any[] = [];
    funcNodes.forEach((node: {
        id: any; data: {
            label: any; userInput: any;
        };
    }) => {
        let eachFuncNode: any = {};
        eachFuncNode['name'] = node.id;
        eachFuncNode['func_label'] = node.data.userInput || node.data.label;
        let bindObject = {};
        edges.map((edge: { id: string | any[]; target: any; source: any; }) => {
            if (edge.id.includes(node.id) && edge.target === node.id) {
                varNodes.map((varNode: {
                    id: string | any[]; data: {
                        label: any; userInput: any;
                    };
                }) => {
                    if (varNode.id.includes(edge.source)) {
                        if (varNode.data.userInput) {
                            Object.assign(bindObject, { [varNode.data.userInput]: varNode.data.userInput });
                        } else {
                            Object.assign(bindObject, { [varNode.data.label]: varNode.data.label });
                        }
                    }
                });
            }
            eachFuncNode['bind'] = bindObject;
            if (edge.id.includes(node.id) && edge.source === node.id) {
                varNodes.map((varNode: {
                    id: string | any[]; data: {
                        label: any; userInput: any;
                    };
                }) => {
                    if (varNode.id.includes(edge.target)) {
                        eachFuncNode['out'] = varNode.data.userInput || varNode.data.label;
                    }
                });
            }

        });

        mapping.push(eachFuncNode);
    });
    return mapping;
}