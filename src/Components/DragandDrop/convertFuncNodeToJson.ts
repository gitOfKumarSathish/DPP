export function convertFuncNodeToJson(jsonData: any) {
    const { name, func_nodes } = jsonData;
    console.log('func_nodes', func_nodes);
    let initialNodes: { id: any; type: string; data: { label: any; }; style: { background: string; border: string; borderRadius: string; color: string; fontSize: number; padding: string; }; }[] = [];
    func_nodes.map((funcNode: {
        bind(arg0: string, bind: any): unknown; name: any; func_label: any;
    }, index: number) => {
        let random = Math.floor(Math.random() * 350);
        const funcObject = {
            id: funcNode.name,
            type: 'custom',
            data: {
                label: funcNode.func_label
            },
            style: {
                background: "#32cd32",
                border: "1px solid #32cd32",
                borderRadius: "0",
                color: "#fff",
                fontSize: 12,
                padding: "1%"
            },
            position: { x: random + index, y: random + index },
        };
        initialNodes.push(funcObject);

        console.log('funcNode.bind', Object.values(funcNode.bind));
        Object.values(funcNode.bind).map(varNode => {
            random = Math.floor(Math.random() * 350);
            const varObject = {
                id: varNode,
                type: 'TextUpdaterNode',
                data: {
                    label: varNode
                },
                style: {
                    background: "#00bfff",
                    border: "1px solid #00bfff",
                    borderRadius: "50%",
                    color: "#fff",
                    fontSize: 12,
                    padding: "1%"
                },
                position: { x: random + index, y: random + index },
            };
            initialNodes.push(varObject);
        });

    });
    console.log('initialNodes', initialNodes);
    return initialNodes;
}