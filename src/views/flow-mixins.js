import * as $ from "jquery"
export const flowMixins = {
    data() {
        return {
            stepId: '',
            operatorCode: String,
            easyFlowVisible: true,
            menuNode: {},
            marginRight: 0,
            index: 1,
            jsPlumb: null,// jsPlumb 实例
            nodeFormVisible: false,
            // 默认设置参数
            jsplumbSetting: {
                Anchors: ["Top", "Bottom"],
                // 动态锚点、位置自适应
                // Anchors: ['Top', 'Bottom'], //'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter', 'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
                Container: 'flowContainer',
                // 连线的样式 StateMachine、Flowchart、Bezier、Straight
                Connector: ['Flowchart', {cornerRadius: 10,}],
                // DragOptions: {cursor: "pointer"},//拖动的时候
                // 鼠标不能拖动删除线
                ConnectionsDetachable: false,
                // 删除线的时候节点不删除
                DeleteEndpointsOnDetach: false,

                // 连线的端点
                Endpoint: ["Dot", {radius: 4, cssClass: "sw-doc"}],
                //Endpoint: ["Rectangle", {height: 5, width: 5}],
                // 线端点的样式
                EndpointStyle: {stroke: 'rgba(25,25,255,0)'},
                LogEnabled: true,//是否打开jsPlumb的内部日志记录
                ConnectionOverlays: [
                    [
                        "PlainArrow", {
                        location: 1,
                        length: 8,
                        width: 8,
                        direction: 1,
                        visible: true,
                    },
                    ],
                ],
                // 绘制线
                PaintStyle: {stroke: '#dcdcdc', strokeWidth: 1, cornerRadius: 10,},
                HoverPaintStyle: {strokeWidth: 2.6, outlineWidth: 6,},
                // 绘制箭头
                // Overlays: [['Arrow', {width: 12, length: 18, location: 1}]],
                RenderMode: "svg",
                anchor: "Static",
            },
            // jsplumb连接参数
            jsplumbConnectOptions: {
                isSource: true,
                isTarget: true,
                maxConnections: 1,
                // 动态锚点、提供了4个方向 Continuous、AutoDefault
                anchor: "Static",
            },
            jsplumbSourceOptions: {
                filter: ".flow-node-drag", /*"span"表示标签，".className"表示类，"#id"表示元素id*/
                anchor: ["Top", "Bottom"]
            },
            jsplumbTargetOptions: {
                filter: ".flow-node-drag", /*"span"表示标签，".className"表示类，"#id"表示元素id*/
                anchor: ["Top", "Bottom"],
            },
            // 是否加载完毕
            loadEasyFlowFinish: false,
            // 数据
            data: {
                nodeList: [
                    /*{
                        checkClick:true,
                        code:"关系库_1",
                        ico:"",
                        id:"1540186926143253",
                        keyWord:"labelMeta",
                        left:"281px",
                        name:"关系库_1",
                        show:true,
                        tableId:"",
                        top:"101px",
                        type:""
                    },
                    {
                        checkClick:true,
                        code:"关系库_1",
                        ico:"",
                        id:"7762045945433416",
                        keyWord:"labelMeta",
                        left:"222px",
                        name:"关系库_1",
                        show:true,
                        tableId:"",
                        top:"142px",
                        type:""

                    }*/
                ],

                lineList: []
            },
            sourceLeft : {
                endpoint: "Rectangle",
                paintStyle: {
                    stroke: "#7AB02C",
                    fill: "transparent",
                    width: 40,
                    height: 50,
                    strokeWidth: 1,
                },
                cssClass: "ce-left",
                isTarget: true,
            },
            sourceRight : {
                endpoint: "Rectangle",
                paintStyle: {
                    stroke: "#7AB02C",
                    fill: "transparent",
                    width: 40,
                    height: 50,
                    strokeWidth: 1,
                },
                cssClass: "ce-right",
                isTarget: true,
            },
            sourceEndpoint : {
                endpoint: "Rectangle",
                paintStyle: {
                    stroke: "#7AB02C",
                    fill: "transparent",
                    width: 80,
                    height: 50,
                    strokeWidth: 1,
                },
                cssClass: "ce-center",
                isTarget: true,
            }
        }
    },
    methods: {
        setNodePoints(nodeId , pluginKeyWord){
            const vm = this , {sourceLeft ,sourceRight ,sourceEndpoint,transPlugins, outputPlugins } = vm;
            let anchor = [];
            if (pluginKeyWord === "unionJoinPlugin") {
                anchor = [[.33, 0, 0, -1], [.66, 0, 0, -1]];
            } else {
                anchor = [[.5, 0, 0, -1]];
            }

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
            vm.jsPlumb.draggable(nodeId, {
                // containment: 'parent'
            })
        },
        // 加载流程图
        loadEasyFlow() {
            const vm = this;
            // 初始化节点
            for (var i = 0; i < this.data.nodeList.length; i++) {
                let node = this.data.nodeList[i],
                pluginKeyWord = node.keyWord;
                vm.setNodePoints(node.id , pluginKeyWord);
            }
            // 初始化连线
            for (let i = 0; i < this.data.lineList.length; i++) {
                let line = this.data.lineList[i] , {target} = line
                this.jsPlumb.connect({
                    source: line.from,
                    target: line.to,
                    anchors:["Bottom", target ],
                }, this.jsplumbConnectOptions)
            }
            this.$nextTick(function () {
                this.loadEasyFlowFinish = true;
            });
        },
        /**
         * 编辑节点
         * @param node
         */
        editAttr(node) {
            if (node.checkError) {
                this.$message.warning("插件初始化失败，无法配置相关信息！");
            } else if (node.checkClick) {
                this.editPlugAttr(node);
            } else {
                this.$message.warning("插件初始化未完成，请耐心等待！");
            }
        },
        /**
         * 设置输入初始化状态
         * @param nodeId
         * @param target
         */
        setSourceState(nodeId, target) {
            this.data.nodeList.forEach(node => {
                if (node.id === nodeId) {
                    node[target] = true;
                }
            })
        },
    }
};
