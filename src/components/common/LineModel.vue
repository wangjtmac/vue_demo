<template>
    <div class="Line">
        <ul class="item">
            <li v-for="node in nodeList" :key="node.id"
                :id="node.id"
                :class="'item-'+node.type"
                :ref="node.id"
                class="item-box">
                <slot :name="node.type"></slot>
            </li>
        </ul>
    </div>
</template>

<script>

import {jsPlumb} from 'jsplumb'

export default {
    name: "LineModel",
    data() {
        return {
            nodeList: [
                {
                    id: "0",
                    type: "top",
                    anchor : ["Bottom"]
                }, {
                    id: "1",
                    type: "left",
                    anchor : ["Left"]
                }, {
                    id: "2",
                    type: "right",
                    anchor : ["Right"]
                },
            ],
            lineList: [
                {
                    from: "0",
                    to: "1",
                    target: [.12 , 0 , 0 ,-1],
                    source : "Bottom"
                }, {
                    from: "0",
                    to: "2",
                    target: "Top",
                    source : "Bottom"
                }, {
                    from: "1",
                    to: "2",
                    target: "Left",
                    source : "Right"
                },{
                    from: "2",
                    to: "1",
                    target: "Right",
                    source : "Left"
                }
            ],
            jsPlumb: null,
            initNode: null,
            jsplumbSetting: {
                // Anchors: ["Top", "Bottom"],
                // 动态锚点、位置自适应
                // Anchors: ['Top', 'Bottom'], //'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
                Container: 'Line',
                // 连线的样式 StateMachine、Flowchart、Bezier、Straight
                Connector: ['Flowchart', {cornerRadius: 10,}],
                // DragOptions: {cursor: "pointer"},//拖动的时候
                // 鼠标不能拖动删除线
                ConnectionsDetachable: false,
                // 删除线的时候节点不删除
                DeleteEndpointsOnDetach: false,

                // 线端点的样式
                EndpointStyle: {stroke: 'rgba(25,25,255,0)'},
                LogEnabled: true,//是否打开jsPlumb的内部日志记录
                ConnectionOverlays: [
                    [
                        "PlainArrow", {
                        location: 1,
                        length: 8,
                        width: 12,
                        direction: 1,
                        visible: true,
                    },
                    ],
                ],
                // 绘制线
                PaintStyle: {stroke: '#0088FF', strokeWidth: 2, },
                RenderMode: "svg",
                anchor: "Static",
            },
            sourceEndpoint: {
                endpoint: "Rectangle",
                paintStyle: {
                    fill: "transparent",
                    width: 0,
                    height: 0,
                    strokeWidth: 1,
                },
                isTarget: true,
            },
            // jsplumb连接参数
            jsplumbConnectOptions: {
                isSource: true,
                isTarget: true,
                maxConnections: 1,
                // 动态锚点、提供了4个方向 Continuous、AutoDefault
                anchor: "Static",
            },
        }
    },
    methods: {
        triggerEvent(type = "resize") {
            let m_event = new Event(type);
            window.dispatchEvent(m_event);
        },
        initLine() {
            const vm = this;
            vm.jsPlumb = jsPlumb.getInstance();
            vm.$nextTick(() => {
                vm.jsPlumbInit()
            })
        },
        jsPlumbInit() {
            const vm = this;
            jsPlumb.ready(function () {
                vm.jsPlumb.importDefaults(vm.jsplumbSetting);
                // 会使整个jsPlumb立即重绘。
                vm.jsPlumb.setSuspendDrawing(false, true);
                // 初始化节点
                vm.loadEasyFlow();

            });
        },
        // 加载流程图
        loadEasyFlow() {
            const vm = this;

            // 初始化节点
            for (let i = 0; i < vm.nodeList.length; i++) {
                let node = vm.nodeList[i];
                vm.setNodePoints(node.id , node.anchor);
            }
            // 初始化连线
            for (let i = 0; i < this.lineList.length; i++) {
                let line = this.lineList[i] , {target ,source} = line
                this.jsPlumb.connect({
                    source: line.from,
                    target: line.to,
                    anchors:[source , target ],
                }, this.jsplumbConnectOptions)
            }
        },
        setNodePoints(nodeId, anchor) {
            const vm = this, {sourceEndpoint} = vm;
            vm.jsPlumb.addEndpoint(nodeId, {
                anchor: anchor,
                ...sourceEndpoint
            });
        },
        resize(){
            this.clearAll();
            this.initLine();
        },
        clearAll(){
            this.jsPlumb.deleteEveryConnection();
            this.jsPlumb.deleteEveryEndpoint();
        }
    },
    mounted() {
        this.initLine();
        window.addEventListener(
                "resize", this.resize, false
        );
    },
    destroyed() {
        this.clearAll();
        window.removeEventListener(
                "resize", this.resize, false
        );
    }
};
</script>

<style scoped lang="less">
.item {
    display: flex;
    padding: 10px;
    flex-wrap: wrap;

    &-box {
        flex: 1;
    }

    &-top {
        min-width: 100%;
        margin-bottom: 76px;
    }

    &-left {
        min-width: 70%;
        position: relative;

        &_pot {
            position: absolute;
            left: 122px;
            top: 0;
        }
    }

    &-right {
        max-width: 242px;
        margin-left: 64px;
    }
}
</style>
