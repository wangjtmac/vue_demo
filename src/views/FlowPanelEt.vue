<template>
    <div class="flow_scroll" @dragover="allowDrop" @drop="drop" v-loading="modelParams.loading">
        <slot name="toolbar" :lines="data.lineList"></slot>
        <div v-if="easyFlowVisible" class="flowPanelEt" ref="parent">
            <ModelNode
                    v-for="node in data.nodeList"
                    :key="node.id"
                    v-if="node.show"
                    :id="node.id"
                    :node="node"
                    @deleteNode="deleteNode"
                    @changeNodeSite="changeNodeSite"
                    @editAttr="editAttr"
                    :ref="node.id"
                    :class="{'ce-plug_trans': transPlugins.indexOf(node.keyWord) > -1, 'ce-plug_output': outputPlugins.indexOf(node.keyWord) > -1}"
            />
        </div>
    </div>

</template>

<script>
/*
* 建模，挖掘插件图标相关组件 暂放到公用 components/flowPanel/flow-plugin目录下，原组件页面还暂留，为了后期如果建模和挖掘需要有不同的功能备用
* 当前使用公用，修改可只调整公用组件
* */
import {jsPlumb} from 'jsplumb'
import ModelNode from './ModelNode.vue'
import $ from "jquery";
import {flowMixins} from "@/views/flow-mixins";


export default {
    name: "FlowPanelEt",
    mixins: [flowMixins],
    components: {
        ModelNode,
    },
    props: {
        rowData: Object,
        tabId: String,
        modelParams: Object
    },
    data() {
        return {
            canDrop: false,
            plugNode: null,
            resData: {},
            loading: true,
            transPlugins: ['serviceInputMeta', 'collisionPlugin', 'rowDenormaliserMeta', 'fieldFilteringMeta', 'labelMeta', 'scriptMeta', 'personCreatorMeta', 'dlwzMapperMeta', 'jwqMapperMeta', 'subtractByKeyPlugin', 'leftOrRightJoinPlugin', 'fullJoinPlugin', 'unionJoinPlugin', 'innerJoinPlugin', 'serviceOrganization', 'windowStreaming', 'reducePlugin', 'luceneBuilderMeta', 'jsonParsingContent', 'samplingAndShuntingPlugin', 'startTaskPlugin', 'dataSortPlugin', 'expressionExcuter', "fileUpload", "zipperTablePlugin", "conditionFilterPlugin", "dateZipperTablePlugin", "numberZipperTablePlugin"],
            outputPlugins: ['kVOutput', 'fullTextOutput', 'standardSqlOutput', 'scatterChartsPlugin', 'radarChartsPlugin', 'pieChartsPlugin', 'barChartsPlugin', 'lineChartsPlugin', 'csvOutput', 'gbaseTableOutput', 'gpOut'],
            deleteNodeWithLine: false,//删除的节点带连线
            zoomNum: 1,
        }
    },
    methods: {
        // 改变画布大小--通过鼠标滚轮 缩小，放大
        changeCanvas(event) {
            var delta = 0;
            var canvasDom = this.$refs.parent;
            var p = ["webkit", "moz", "ms", "o"];
            if (!event) event = window.event;
            if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                delta = event.wheelDelta / 120;
                if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
            } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                delta = -event.detail / 3;
            }
            if (delta > 0) {
                // 向上滚
                if (this.zoomNum < 2) {
                    this.zoomNum += 0.1;
                }
            } else if (delta < 0) {
                // 向下滚
                if (this.zoomNum > 0.2) {
                    this.zoomNum -= 0.1;
                }
            }
            for (var i = 0; i < p.length; i++) {
                canvasDom.style[p[i] + "Transform"] = "scale(" + this.zoomNum + ")";
            }
            canvasDom.style["transform"] = "scale(" + this.zoomNum + ")";
            return false;
        },
        editdialogAttr(node) {
            this.$emit('slideAttr', true);
            this.$emit('hideSource', false);
        },
        attrWidth(node) {
            let nodes = ['散点图', '甘特图', '雷达图', '饼图', '柱状图', '折线图'], width = '460px';
            for (let i = 0; i < nodes.length; i++) {
                if (node.name.indexOf(nodes[i]) > -1) {
                    return width = '370px';
                }
            }
            return width;
        },
        editPlugAttr(node) {
            let width = this.attrWidth(node);
            this.$emit('slideAttr', width, this.tabId);
            globalBus.$emit('slideAttr', node, true, width, this.tabId);
            globalBus.$emit('hideSource', true, this.tabId);
            this.$emit('hideSource', false, this.tabId);
        },
        isAllow() {
            this.canDrop = false;
        },
        setPlugNode(plug) {
            this.plugNode = plug;
            this.canDrop = true;
        },
        drop(e) {
            this.addNode(e, this.plugNode);
        },

        allowDrop(e) {
            if (this.canDrop) {
                e.preventDefault();
            }
        },
        //jsPlumb初始化
        jsPlumbInit() {
            const vm = this;
            vm.jsPlumb.ready(function () {
                // 导入默认配置
                vm.jsPlumb.importDefaults(vm.jsplumbSetting);
                // 会使整个jsPlumb立即重绘。
                vm.jsPlumb.setSuspendDrawing(false, true);
                // 初始化节点
                vm.loadEasyFlow();

                // 单点击了连接线,
                vm.jsPlumb.bind('click', function (conn, originalEvent) {
                    vm.deleteNodeWithLine = false;
                    vm.jsPlumb.deleteConnection(conn);
                });
                // 连线
                vm.jsPlumb.bind("connection", function (evt) {
                    let fromName = evt.source.innerText;
                    let fromId = evt.source.id;
                    let toName = evt.target.innerText;
                    let toId = evt.target.id;

                    let line = vm.jsPlumb.getConnections({
                        from: fromId,
                        to: toId
                    });


                    /*line[0].setData({
                        from: fromId,
                        to: toId ,
                        anchor: "Static",
                    });*/
                    let data = line[0].getData();
                    vm.data.lineList.push({
                        from: fromId,
                        to: toId
                    })
                });

                // 删除连线
                vm.jsPlumb.bind("connectionDetached", function (evt) {
                    vm.deleteLine(evt.sourceId, evt.targetId)
                });

                // 改变线的连接节点
                vm.jsPlumb.bind("connectionMoved", function (evt) {
                    // console.log('connectionMoved', evt)
                    vm.changeLine(evt.originalSourceId, evt.originalTargetId)
                });
                // contextmenu
                vm.jsPlumb.bind("contextmenu", function (evt) {
                    console.log('contextmenu', evt)
                });
                // beforeDrop
                vm.jsPlumb.bind("beforeDrop", function (evt) {
                    // console.log('beforeDrop', evt)
                    let from = evt.sourceId;
                    let to = evt.targetId;
                    if (from === to) {
                        vm.$message.error('不能连接自己');
                        return false;
                    }
                    let chartCodes = ['scatterChartsPlugin', 'radarChartsPlugin', 'pieChartsPlugin', 'barChartsPlugin', 'lineChartsPlugin', 'fileOutputMeta', 'fullTextOutput', 'standardSqlOutput',],//输出类插件 不输出其他插件
                            otherCode = ['dataSortPlugin'],
                            outputCodes = ['fileInput', 'kVOutput', 'fullTextOutput', 'standardSqlOutput', 'csvOutput', 'gbaseTableOutput', 'gpOut',];
                    for (let i = 0; i < vm.data.lineList.length; i++) {
                        var line = vm.data.lineList[i];
                        if (line.from === from && line.to === to) {
                            vm.$message.error('不能重复连线');
                            return false;
                        }
                        if (line.from === to && line.to === from) {
                            vm.$message.error('不能回环哦');
                            return false;
                        }
                        for (let j in vm.data.nodeList) {
                            let code = vm.data.nodeList[j].keyWord;
                            if (vm.data.nodeList[j].id === to && [...outputCodes, ...otherCode].indexOf(code) > -1 && line.to === to) {
                                let pluginN = code === 'dataSortPlugin' ? '数据排序' : "输出";
                                vm.$message.error(`${pluginN}插件只能有一个输入!`);
                                return false;
                            }
                        }
                    }
                    for (let k in vm.data.nodeList) {
                        let code = vm.data.nodeList[k].keyWord;
                        if (vm.data.nodeList[k].id === from && chartCodes.indexOf(code) > -1) {
                            let pluginN = vm.data.nodeList[k].code.replace(/_.*/g, "");
                            vm.$message.error(`${pluginN}插件不能输出其他插件!`);
                            return false;
                        }
                    }
                    return true;
                });

                // beforeDetach
                vm.jsPlumb.bind("beforeDetach", async function (evt) {
                    //console.log('beforeDetach', evt)
                })
            })
        },
        checkOneRoad(from, to) {
            let lineArr = [];
            this.data.lineList.forEach(l => {
                if (lineArr.indexOf(l.from) === -1) {
                    lineArr.push(l.from);
                }
                if (lineArr.indexOf(l.to) === -1) {
                    lineArr.push(l.to);
                }
            });
            return lineArr.indexOf(to) === -1 && lineArr.indexOf(from) === -1;
        },
        checkParallelRod(to, lines) {
            const vm = this;
            let line = vm.data.lineList.filter(l => {
                return l.from === to || l.to === to;
            });
            if (line.length === 0 || lines.length === 0) return false;
            let lineArr = [];
            lines.forEach(l => {
                if (lineArr.indexOf(l.from) === -1 && line[0].from !== l.from) {
                    lineArr.push(l.from);
                }
                if (lineArr.indexOf(l.to) === -1 && line[0].to !== l.to) {
                    lineArr.push(l.to);
                }
            });
            return lineArr.indexOf(line[0].to) === -1 && lineArr.indexOf(line[0].from) === -1;
        },
        removeLineFn(from, to) {
            return this.data.lineList.filter(function (line) {
                return !(line.from === from && line.to === to);
            });
        },
        // 删除线
        async deleteLine(from, to) {
            const vm = this;
            vm.data.lineList = vm.data.lineList.filter(line => !(line.from === from && line.to === to));
            vm.$message.success("步骤连线删除成功!");
        },
        // 改变连线
        changeLine(oldFrom, oldTo) {
            this.deleteLine(oldFrom, oldTo);
        },
        // 改变节点的位置
        changeNodeSite(data) {
            const vm = this;
            let x = data.left.substring(0, data.left.length - 2), y = data.top.substring(0, data.top.length - 2);

            for (let i = 0; i < this.data.nodeList.length; i++) {
                let node = this.data.nodeList[i];
                if (node.id === data.nodeId) {
                    node.left = data.left;
                    node.top = data.top;
                }
            }
        },
        // 添加新的节点
        addNode(evt, nodeMenu) {
            const vm = this;
            let width = 42;
            const index = this.index++;
            let x, y;
            if (evt.target.className === 'flowPanelEt') {
                x = evt.offsetX - width + this.$refs.parent.scrollLeft;
                y = evt.offsetY + this.$refs.parent.scrollTop - 25;
            } else {
                x = $(evt.target).parents('.modelNode').position().left + this.$refs.parent.scrollLeft + 10;
                y = $(evt.target).parents('.modelNode').position().top + this.$refs.parent.scrollTop + 10;
            }

            let name = vm.newNameBeing(nodeMenu.label + "_" + index);
            let parentTransId = "0";
            //创建步骤
            this.addPluginTranStep(nodeMenu, name, x, y, parentTransId);
        },
        //名称是否已存在
        newNameBeing(name) {
            const vm = this;
            let sameN = vm.data.nodeList.filter(node => node.name === name);
            if (sameN.length) {
                return name + '-1';
            } else {
                return name;
            }
        },
        uuid(len, radix) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [],
                    i;
            radix = radix || chars.length;
            if (len) {
                for (i = 0; i < len; i++) {
                    uuid[i] = chars[0 | Math.random() * radix]
                }
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        },
        //添加插件
        addPluginTranStep(nodeMenu, name, x, y, parentTransId) {
            const vm = this, {transPlugins, outputPlugins} = vm;
            let pluginKeyWord = nodeMenu.keyWord, dataType = "";
            let tableID = "";
            tableID = "";
            dataType = "";
            let nodeId = vm.uuid(16, 10);
            let node = {
                left: x + 'px',
                top: y + 'px',
                id: nodeId,
                name: name,
                code: name,
                keyWord: pluginKeyWord,
                tableId: tableID,
                ico: nodeMenu.icon,
                show: true,
                type: dataType, //需要type 判断是数据资源还是组件
                checkClick: true
            };

            vm.data.nodeList.push(node);
            vm.$nextTick(function () {
                let anchor = [], targetA;
                if (pluginKeyWord === "unionJoinPlugin") {
                    anchor = [[.33, 0, 0, -1], [.66, 0, 0, -1]];
                    targetA = [[.33, 0, 0, -1], [.66, 0, 0, -1]]
                } else {
                    anchor = [[.5, 0, 0, -1]];
                    targetA = [[.5, 0, 0, -1],]
                }

                const sourceLeft =
                                {
                                    endpoint: "Rectangle",
                                    paintStyle: {
                                        stroke: "#7AB02C",
                                        fill: "transparent",
                                        width: 30,
                                        height: 30,
                                        strokeWidth: 1,
                                    },
                                    cssClass: "ce-left",
                                    isTarget: true,
                                },
                        sourceRight = {
                            endpoint: "Rectangle",
                            paintStyle: {
                                stroke: "#7AB02C",
                                fill: "transparent",
                                width: 30,
                                height: 30,
                                strokeWidth: 1,
                            },
                            cssClass: "ce-right",
                            isTarget: true,
                        },
                        sourceEndpoint = {
                            endpoint: "Rectangle",
                            paintStyle: {
                                stroke: "#7AB02C",
                                fill: "transparent",
                                width: 60,
                                height: 30,
                                strokeWidth: 1,
                            },
                            cssClass: "ce-center",
                            isTarget: true,
                        };

                let paintStyle = {stroke: '#66a6e0', fill: "#fff"};
                if (transPlugins.indexOf(pluginKeyWord) > -1) {
                    paintStyle.stroke = "#FFBB54";
                } else if (outputPlugins.indexOf(pluginKeyWord) > -1) {
                    paintStyle.stroke = "#66CDAA";
                }

                for (let a in anchor) {
                    if(pluginKeyWord === "unionJoinPlugin"){
                        let option = a === "0" ? sourceLeft : sourceRight;
                        vm.jsPlumb.addEndpoint(nodeId, {
                            anchor: anchor[a],
                            ...option
                        });
                    }else {
                        vm.jsPlumb.addEndpoint(nodeId, {
                            anchor: anchor[a],
                            ...sourceEndpoint
                        });
                    }

                }
                // 设置源点，可以拖出线连接其他节点
                vm.jsPlumb.makeSource(nodeId, {
                    filter: ".dc-link_dot",
                    anchor: ["Bottom"]
                });
                // 设置目标点，其他源点拖出的线可以连接该节点
                /*vm.jsPlumb.makeTarget(nodeId, {
                    filter: ".dc-link_dot",
                    anchor : targetA
                });*/
                vm.jsPlumb.draggable(nodeId, {
                    containment: 'parent'
                })
            })
        },
        // 是否具有该线
        hasLine(from, to) {
            for (let i = 0; i < this.data.lineList.length; i++) {
                let line = this.data.lineList[i];
                if (line.from === from && line.to === to) {
                    return true;
                }
            }
            return false
        },
        // 是否含有相反的线
        hashOppositeLine(from, to) {
            return this.hasLine(to, from);
        },
        //是否有连线
        ownLine(from, to) {
            for (let i = 0; i < this.data.lineList.length; i++) {
                let line = this.data.lineList[i];
                if (line.from === from || line.to === to) {
                    return true;
                }
            }
            return false
        },
        //删除节点
        deleteNode(nodeId) {
            const vm = this;
            let msg = '';
            for (let i = 0; i < this.data.lineList.length; i++) {
                if (nodeId.id === this.data.lineList[i].from) {
                    for (let j = 0; j < this.data.nodeList.length; j++) {
                        if (this.data.lineList[i].to === this.data.nodeList[j].id) {
                            if (this.data.nodeList[j].keyWord === "serviceOrganization") {
                                msg = '(删除后请重新配置算子编排!)';
                                break;
                            }
                        }
                    }
                }
            }
            vm.$message.success("成功删除节点");
            vm.deleteNodeWithLine = true;
            vm.jsPlumb.removeAllEndpoints(nodeId.id);
            vm.data.nodeList = vm.data.nodeList.filter(node => {
                if (node.id === nodeId.id) {
                    node.show = false;
                }
                return node.id !== nodeId.id;
            });
            vm.data.lineList = vm.data.lineList.filter(node => !(node.from === nodeId.id || node.to === nodeId.id));
        },
        //编辑节点
        editNode(nodeId) {
            this.nodeFormVisible = true;
            this.$nextTick(function () {
                this.$refs.nodeForm.init(this.data, nodeId)
            });
        },
        dataReload() {
            const vm = this, {modelParams} = this;
            vm.easyFlowVisible = false;
            vm.data.nodeList = [];
            vm.data.lineList = [];
            modelParams.loading = true;
            vm.$nextTick(() => {
                modelParams.loading = false;
                vm.easyFlowVisible = true;
                vm.$nextTick(() => {
                    vm.jsPlumb = jsPlumb.getInstance();
                    vm.$nextTick(() => {
                        vm.jsPlumbInit()
                    })
                })
            })
        },
        changeLabel() {
            var lines = this.jsPlumb.getConnections({
                source: 'nodeA',
                target: 'nodeB'
            });
            lines[0].setLabel({
                label: '   ',
                cssClass: 'labelClass'
            });
        },
        setInstanceList(value) {
            this.$emit("setInstanceList", value);
        },
    },
    created() {
        this.dataReload();
    },


}
</script>

<style scoped>
.canvas {
    /* width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    position: relative; */
    width: 50px;
    height: 50px;
    position: relative;
    left: 20px;
    top: 20px;
    transform-origin: 50% 50%;
    cursor: pointer;
}

.flowPanelEt {
    margin-right: auto;
    transition: 300ms;
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
}

.flow_scroll {
    height: 100%;
    position: relative;
}

</style>
<style>
.ce-plug_trans .flow-node-header {
    /*background-color: #FFBB54;*/
    color: #FFBB54;
    border-color: #FFBB54;
}

.ce-plug_trans .flow-node-body, .ce-plug_trans .dc-link_dot {
    border-color: #FFBB54;
}

.ce-plug_trans .flow-shadow:hover {
    box-shadow: #FFBB54 0 0 12px 0;
}

.ce-plug_trans.node:hover .flow-name, .ce-plug_trans.node:hover .eda_icon {
    color: #FFBB54;
}

.ce-plug_output .flow-node-header {
    /*background-color: #66CDAA;*/
    color: #66CDAA;
    border-color: #66CDAA;
}

.ce-plug_output .flow-node-body, .ce-plug_output .dc-link_dot {
    border-color: #66CDAA;
}

.ce-plug_output .flow-shadow:hover {
    box-shadow: #66CDAA 0 0 12px 0;
}

.ce-plug_output.node:hover .flow-name, .ce-plug_output.node:hover .eda_icon {
    color: #66CDAA;
}

.sw-doc {
    z-index: 10;
}

.ce-left {
    transform: translate(-15px, 15px);
    z-index: -1;
}

.ce-right {
    transform: translate(10px, 15px);
    z-index: -1;
}

.ce-center {
    transform: translate(0px, 15px);
    z-index: -1;
}
</style>
