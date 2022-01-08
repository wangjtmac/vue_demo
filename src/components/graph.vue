<template>
    <div class="container" ref="container"></div>
</template>

<script>
import G6 from "@antv/g6";

export default {
    name: "graph",
    data() {
        return {
            graph: null,
            nodeData: {
                nodes: [],
                edges: [],
                combos: [],
            },
            graphOption : {},
            defaultEdge: {
                type: 'quadratic',
                labelCfg: {
                    autoRotate: true,
                },
            },
            defaultNode: {
                size: 50,
                color: '#5B8FF9',
                style: {
                    lineWidth: 2,
                    fill: '#C6E5FF',
                },
                labelCfg: {
                    position: 'bottom',
                    style : {
                        fill : "#333"
                    }
                },
            },
            defaultCombo : {
                style: {
                    lineWidth: 1,
                    color:"#999",
                },
                labelCfg : {
                    style :{
                        fill : "#999"
                    }
                }

            },
            // 默认边不同状态下的样式集合
            edgeStateStyles: {
                'edgeState:default': {
                    stroke: '#c5bdf4',
                },
                'edgeState:selected': {
                    animate: true,
                    lineWidth: 3,
                    stroke: '#f6bd16',
                },
                'edgeState:hover': {
                    lineWidth: 3,
                    animate: true,
                    stroke: '#f6bd16',
                },
            },
            markTip: "",
            filter_rule: {}
        }
    },
    methods: {
        clearWord() {
            if (this.graph) this.graph.clear();
            this.nodeData = {
                nodes: [],
                edges: [],
                combos: []
            };
        },
        loadData() {
            const vm = this, {defaultEdge, defaultNode,defaultCombo , graphOption} = vm;
            // 先清空原G6画布数据
            const container = vm.$refs.container;
            container.innerHTML = "";
            // 获取G6画布应该展示的大小
            const width = container.scrollWidth,
                height = container.scrollHeight || 280,
                padding = 20;
            const menu = new G6.Menu({
                offsetX: -20,
                offsetY: -50,
                itemTypes: ['edge'],
                getContent(e) {
                    const outDiv = document.createElement('div');
                    outDiv.style.width = '80px';
                    outDiv.style.cursor = 'pointer';
                    outDiv.innerHTML = '<p id="deleteRelation">删除关系</p>';
                    return outDiv;
                },
                handleMenuClick(target, item) {
                    const {id} = target;
                },
            });
            const minimap = new G6.Minimap({
                size: [200, 100],
            });
            let option = Object.assign({
                container,
                width,
                height,
                // fitView: true,
                fitViewCenter : true,
                // linkCenter: true,
                fitViewPadding: padding,
                minZoom: .5,
                maxZoom: 2,
                layout : {
                    type : "gForce",
                    linkDistance: 250,
                },
                defaultEdge,
                defaultNode,
                defaultCombo,
                modes: {
                    default: ['drag-combo', 'drag-node', 'drag-canvas'],
                },
                plugins: [menu, minimap],
            },graphOption);
            G6.Util.processParallelEdges(vm.nodeData.edges);
            vm.graph = new G6.Graph(option);

            // 组装的数据
            vm.graph.read(vm.nodeData);
            vm.graph.render();
            vm.initNodeEvent();
        },
        initNodeEvent() {
            this.graph.on('node:click', this.nodeClickFn);
            this.graph.on("canvas:click", this.canvasClickFn);
            this.graph.on("on-edge-mousemove", this.showTooltip);
            this.graph.on("on-edge-mouseleave", this.hideTooltip);
        },
        hideTooltip() {
            this.$emit("hideTooltip");
        },
        showTooltip(e) {
            if (e && e.item) {
                let tooltip = e.item.get('model').label,
                    left = e.clientX + 40,
                    top = e.clientY - 20;
                this.$emit("showTooltip", tooltip, left, top);
            }
        },
        /**
         * 画布点击事件
         * */
        canvasClickFn(e) {

        },
        /**
         * 节点点击事件
         * */
        async nodeClickFn(e) {
            if (e && e.item) {
                const vm = this, model = e.item.get('model');
            }
        },
        /**
         * 配置词和标签
         * @param data
         * @param options
         */
        initWordData(data , options) {
            this.nodeData = data;
            this.graphOption = options;
        },
        async reloadData(data) {
            this.clearWord();
            await this.initWordData(data);
            this.$nextTick(() => {
                this.loadData();
            });
        },
        /**
         * 重新渲染
         */
        wordRender() {
            if (this.nodeData) {
                this.$nextTick(() => {
                    this.loadData();
                });
            }
        },
    },
    created() {
    },
    mounted() {
        window.addEventListener("resize", this.wordRender);
    },
    beforeDestroy() {
        if (this.graph) this.graph.destroy();
        window.removeEventListener("resize", this.wordRender);
    }
}
</script>

<style scoped>
.container {
    margin: auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

</style>
<style>
.g6-minimap {
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
