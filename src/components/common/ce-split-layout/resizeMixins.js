export const resizeMixins = {
    methods: {
        nodeResize(data, id, split, dir ) {
            const vm = this;
            let node = data.find(d => d.id === id),
                nodeInx = data.findIndex(d => d.id === id);
            node && vm.getResizeMethod(dir , {node, nodeInx, data, split});
            data.forEach((item) => {
                if (item.children && item.children.length) vm.nodeResize(item.children, id, split, dir);
            })
        },
        splitResize(e, id, split, dir) {
            this.nodeResize(this.data, id, split, dir);
        },
    }
}
