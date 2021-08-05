import {jsPlumb} from 'jsplumb'

export const DemoJsplumb = {
    data() {    //数据
        return {
            pluginList: [
                {label: "碰撞",keyWord:"unionJoinPlugin"},
                {label: "输入",keyWord: "inputMeta"},
                {label: "关系库",keyWord: "labelMeta"},
                {label: "全文",keyWord: "kVOutput"},
                {label: "柱状",keyWord: "gpOut"},
                {label: "折线",keyWord: "csvOutput"},
            ],
            targetId: "",
            sourceId: "",
            instance: null,
            initNode: null,
            activeName: 'first',
            start: 0, //初次拖动
            configJson: {
                dom: [],
                links: []
            },
            // 右键菜单
            contextmenuShow: false,
            position: {
                x: '',
                y: ''
            },
            zoomNum: 1,
            disX: null,
            disY: null,
            mainX: null,
            mainY: null,
            ifDrag: false,

            jsPlumbInstance: "", // 画线实例
            // jsPlumb默认配置
            jsPlumbSetting: {
                Container: "canvas",
                // 连线的样式 StateMachine、Flowchart
                Connector: "Flowchart",
                // 鼠标不能拖动删除线
                ConnectionsDetachable: false,
                // 删除线的时候节点不删除
                DeleteEndpointsOnDetach: false,
                // 连线的端点
                Endpoint: ["Dot", {radius: 3}],
                EndpointStyle: {
                    stroke: "#888",
                    fill: "#fff"
                },
                LogEnabled: true,//是否打开jsPlumb的内部日志记录
                // 绘制线
                PaintStyle: {stroke: '#2d81b3', strokeWidth: 2},
                HoverPaintStyle: {strokeWidth: 3},
                // 绘制箭头
                Overlays: [['Arrow', {width: 12, length: 10, location: 1}]],
                RenderMode: "svg",
            },
            jsPlumbConnectOptions: {
                isSource: true,
                isTarget: true,
                // 动态锚点、提供了4个方向 Continuous、AutoDefault
                anchor: "AutoDefault"
            },
            jsplumbSourceOptions: {
                filter: ".flow-node-drag", /*"span"表示标签，".className"表示类，"#id"表示元素id*/
                filterExclude: false,
                anchor: "Continuous",
                allowLoopback: false
            },
            jsplumbTargetOptions: {
                filter: ".flow-node-drag", /*"span"表示标签，".className"表示类，"#id"表示元素id*/
                filterExclude: false,
                anchor: "Continuous",
                allowLoopback: false
            },
            nodeList: [],
            lineList: [],
            curItem: {}
        }
    },
    mounted() {
        this.drawLines();
    },
    methods: {   //方法放置位置
        jsPlumbInit(){
            this.jsPlumb.ready(() => {
                this.jsPlumb.importDefaults(this.jsPlumbSetting);
                this.jsPlumb.repaintEverything(); // 重绘
                // 会使整个jsPlumb立即重绘。
                this.jsPlumb.setSuspendDrawing(false, true);
            })
        },
        drawLines() {
            const vm = this;
            vm.$nextTick(() => {
                vm.jsPlumb = jsPlumb.getInstance();
                vm.$nextTick(() => {
                    vm.jsPlumbInit()
                })
            })
        },
        //jsplumb初始化
        init(_this) {
            const vm = this;
            jsPlumb.ready(function () {
                vm.instance = jsPlumb.getInstance({
                    Endpoint: ["Dot", {
                        radius: 2,
                        cssClass: "dot"
                    }],
                    Connectors: "StateMachine",
                    PaintStyle: {
                        stroke: "#93bdf7",
                        strokeWidth: 2
                    },
                    HoverPaintStyle: {
                        stroke: "#2583ff",
                        strokeWidth: 3
                    },
                    ConnectionOverlays: [
                        ["Arrow", {
                            location: 1,
                            id: "arrow",
                            length: 8,
                            width: 8,
                            foldback: 0.8
                        }],
                        ["Label", {
                            label: "",
                            id: "label",
                            cssClass: "aLabel"
                        }]
                    ],
                    Container: "canvas"
                });
                //Bezier: 贝塞尔曲线
                // Flowchart: 具有90度转折点的流程线
                // StateMachine: 状态机
                // Straight: 直线
                vm.instance.registerConnectionType("basic", {
                    anchor: "Continuous",
                    connector: 'Flowchart'
                });
                // 右键菜单
                jsPlumb.on(document.getElementById("canvas"), "contextmenu", ".model-list-li", vm.contextmenuOnFileItem);
                //初始化节点
                vm.initNode = function (el) {
                    vm.instance.draggable(el,
                        {
                            containment: true
                        }
                    );
                };

            });
        },
        //拖拽开始事件
        drag(evt, item) {
            this.curItem = item;
            this.$refs.flow.setPlugNode(item);
            evt.dataTransfer.setData("Text", evt.target.id);
        },
        //维度 拖动目标 放置方法
        drop(evt) {
            const vm = this;
            var componentsType = evt.dataTransfer.getData("Text"),
                _this = this;
            let {curItem} = this;
            _this.preventDefault(evt);
            // 生成唯一id
            var tid = "t" + this.uuid(8);
            var dom = {
                "id": tid,
                "label": curItem.label,
                "name": componentsType,
                "style": {
                    "left": "",
                    "top": ""
                }
            };
            var link = {
                "source": "",
                "target": "",
                "type": "basic"
            };
            dom.top = event.offsetY + "px";
            dom.left = event.offsetX + "px";
            this.nodeList.push(dom);
            this.lineList.push(link);
            vm.$nextTick( ()=> {
                vm.jsPlumb.makeSource(tid, vm.jsplumbSourceOptions);
                vm.jsPlumb.makeTarget(tid, vm.jsplumbTargetOptions);
                vm.jsPlumb.draggable(tid, {
                    containment: 'parent'
                })
            })
        },
        //创建新的节点
        newNode(dom, link) {
            var canvas = document.getElementById("canvas");
            var oDiv = document.createElement("div");
            oDiv.className = "model-list-li";
            oDiv.id = dom.id;
            oDiv.setAttribute('tid', dom.id);
            var html = "";
            html += "<div class='par-bac'><p class='nowrap'>" + dom.name + ' && ' + dom.label + "</p>";
            html += "<div class='triangle-bottomleft'></div>";
            html += "</div>";
            oDiv.innerHTML = html;
            oDiv.style.left = dom.style.left;
            oDiv.style.top = dom.style.top;
            this.jsPlumbInstance.getContainer().appendChild(oDiv);
            var windows = document.getElementById(dom.id);
            this.initNode(windows, true);
            if (this.configJson.dom.length > 1) {
                this.instance.connect(link);
            }
        },
        allowDrop(evt) {
            this.preventDefault(evt);
        },
        dragEnter(evt) {
            this.preventDefault(evt);
        },
        // ==漫游====
        // 拖拽
        mouseDrag(e) {
            let _this = this;
            this.ifDrag = true;
            let pos = _this.getPos(e); //获取鼠标坐标
            _this.disX = pos.x;
            _this.disY = pos.y;
            _this.mainX = _this.$refs.canvas.offsetLeft - 200;
            _this.mainY = _this.$refs.canvas.offsetTop;
            if (this.ifDrag) {
                this.mouseMove(e);
            }
        },
        mouseMove(e) {
            var _this = this;
            document.onmousemove = function (e) {
                var evt = window.event || e;
                var left = (evt.clientX - _this.disX) + _this.mainX;
                var top = (evt.clientY - _this.disY) + _this.mainY;
                _this.$refs.canvas.style.left = left + 'px';
                _this.$refs.canvas.style.top = top + 'px';
            }
            this.mouseUp();
        },
        mouseUp() {
            var _this = this;
            //鼠标抬起
            document.onmouseup = function (e) {
                var evt = window.event || e;
                document.onmousemove = null;
                document.onmouseup = null;
                _this.ifDrag = false;
            };
        },
        // 获取位置
        getPos(ev) {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            return {x: ev.clientX + scrollLeft, y: ev.clientY + scrollTop};
        },
        // 改变画布大小--通过鼠标滚轮 缩小，放大
        changeCanvas(event) {
            var delta = 0;
            var canvasDom = document.getElementById('canvas');
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
        // 保存完初始化画布
        initCanvas() {
            var canvas = document.getElementById("canvas");
            var dom = this.configJson.dom;
            var links = this.configJson.links;
            for (let i = 0; i < dom.length; i++) {
                let oDiv = document.createElement("div");
                oDiv.className = "model-list-li";
                oDiv.id = dom[i].id;
                oDiv.setAttribute('tid', dom[i].id);
                var html = "";
                html += "<div class='par-bac'><p class='nowrap'>" + dom[i].name + ' && ' + dom[i].label + "</p>";
                html += "<div class='triangle-bottomleft'></div>";
                html += "</div>";
                oDiv.innerHTML = html;
                oDiv.style.left = dom[i].style.left;
                oDiv.style.top = dom[i].style.top;
                this.instance.getContainer().appendChild(oDiv);
                var windows = document.getElementById(dom[i].id);
                this.initNode(windows, true);
                if (i > 0) {
                    this.instance.connect(links[i]);
                }
            }
        },
        // 保存按钮
        saveClick() {
            console.log(this.configJson);
            // 此处相当于保存到后台
            localStorage.setItem('configJson', JSON.stringify(this.configJson));
        },
        // 清空按钮
        clearClick() {
            localStorage.removeItem('configJson');
        },
        //阻止冒泡以及默认事件
        preventDefault(evt) {
            var evt = evt || window.event;
            if (typeof evt.preventDefault == "function") {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
            if (typeof evt.stopPropagation == "function") {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true
            }
        },
        // 生成uuid
        // 8 character ID (base=2)
        //uuid(8, 2) // "01001010"
        // 8 character ID (base=10)
        //uuid(8, 10) // "47473046"
        // 8 character ID (base=16)
        //uuid(8, 16) // "098F4D35"
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
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        },
        // 右键事件
        contextmenuOnFileItem(ev) {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement,
                targets = null;
            this.contextmenuShow = true;
            this.position = {
                x: ev.clientX,
                y: ev.clientY
            };
        },
        contextClick() {
            this.contextmenuShow = false;
            return false;
        },
        // 阻止右键默认事件
        contextPre() {
            event.preventDefault();
            return false;
        },
        deleteClick() {
            alert('删除');
        },
        editClick() {
            alert('编辑');
        },
        renameClick() {
            alert('重命名');
        }
    },
    watch: {}
}
