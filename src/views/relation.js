export const data = {
    nodes :[
        {
            id: 'node1',
            label: 'A',
            comboId : ["b"]
        },
        {
            id: 'node1',
            label: 'A',
            comboId : ["a"]
        },
        {
            id: 'node3',
            label: 'C',
        },
    ],
    edges : [

    ],
    combos :[
        {
            id : "a" ,
            label : "de"
        },{
            id : "b" ,
            label : "121"
        },
    ]
}

for (let i = 0; i < 10; i++) {
    data.edges.push({
        source: 'node1',
        target: 'node2',
        label: `${i}th edge of A-B`,
    });
}
for (let i = 0; i < 5; i++) {
    data.edges.push({
        source: 'node2',
        target: 'node3',
        label: `${i}th edge of B-C`,
    });
}
