/**
 * 通用画板脚本
 * 缩放以左上角为origin
 * 固定先移动 再缩放  translate() scale()
 * @Author: zhanbh
 * @Date: 2020-08-20
 * @Project mist-web-vue
 */

import {throttle} from "lodash";
import MouseMoveHelper from './MouseMoveHelper'

// 创建的实例序号  因为同个流程可能同时展示在多个画布上，jsplumb又是以id作为标识，
// 故需要加画布id来作为前缀区分不同的流程实例
let  panelNo = 0;

export default {
    name: "CommonPanel",
    provide() {
        // 提供画布前缀作为标识来区分不同的画布实例，解决jsplumb以id作为标识导致的id冲突问题
        return {
            panelPrefix: `common-panel-${this.panelNo}-`
        }
    },
    props: {
        minZoom: Number, // 非正数表示不限制
        maxZoom: Number,

        minY: Number,
        minX: Number,

        maxX: Number,
        maxY: Number,

        zoom: {
            type: Number,
            default: 1
        },
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isToMove: true,
            isMoving: false,
            panelNo: panelNo,
            _moveHelper: null // 不需要响应式
        };
    },
    computed: {
        zoomRange() {
            const vm = this;
            let {minZoom, maxZoom} = vm;
            return vm.getRange(minZoom, maxZoom, [Number.EPSILON, Number.MAX_VALUE], [1, 1]);
        },
        xRange() {
            const vm = this;
            let {minX, maxX} = vm;
            return vm.getRange(minX, maxX);
        },
        yRange() {
            const vm = this;
            let {minY, maxY} = vm;
            return vm.getRange(minY, maxY);
        },
        validZoom() {
            const vm = this;
            return vm.getValidNum(vm.zoom, vm.zoomRange, 1);
        },
        validX() {
            const vm = this;
            return vm.getValidNum(vm.x, vm.xRange, 0);
        },
        validY() {
            const vm = this;
            return vm.getValidNum(vm.y, vm.yRange, 0);
        },
        transform() {
            const vm = this;
            let {validZoom, validX, validY} = vm;

            return {
                transform: `translate(${validX}px, ${validY}px) scale(${validZoom})`
            }
        },
        cssClasses() {
            const vm = this;
            let fields = ['isToMove', 'isMoving'];
            let classes = [];

            if (vm.isMoving) {
                fields.shift();
            }

            fields.forEach(field => {
                if (vm[field]) {
                    let status = field.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^is-/ig, '');
                    classes.push(`common-panel--${status}`);
                }
            });

            return classes;
        }
    },
    watch: {
        /**
         * 缩放值改变，触发更新事件
         */
        transform() {
            const vm = this;
            let {validZoom, validX, validY} = vm;

            vm.checkChange(validX, validY, validZoom);
        }
    },
    methods: {

        /**
         * 判断是否是有效数字
         * @param num
         * @returns {boolean}
         */
        isNumber(num) {
            return typeof num === 'number' && !Number.isNaN(num);
        },

        /**
         * 根据范围 获取合法数值 在范围两边的值取范围端点值
         * @param num 初始值
         * @param range 范围
         * @param fallback 无效值时的默认值
         * @return 符合范围要求的值
         */
        getValidNum(num, range, fallback) {
            const vm = this;

            if (vm.isNumber(num)) {
                num = Math.max(range[0], num);
                num = Math.min(range[1], num);
            } else {
                num = fallback;
            }

            return num;
        },

        /**
         * 根据提供的最大值最小值，以及最大范围，生成实际范围值
         * @param min 最小值
         * @param max 最大值
         * @param maxRange 初始最大范围
         * @param limit 最小值的最大值，最大值的最小值
         */
        getRange(min, max, maxRange = [-Number.MAX_VALUE, Number.MAX_VALUE], limit = [0, 0]) {
            const vm = this;
            let range = [];

            range[0] = vm.getValidNum(min, [maxRange[0], limit[0]],  maxRange[0]);
            range[1] = vm.getValidNum(max, [limit[1], maxRange[1]], maxRange[1]);

            return range;
        },

        /**
         * 检测是否有改变， 有的话触发事件
         * @param newX
         * @param newY
         * @param newZoom
         */
        checkChange(newX, newY, newZoom) {
            const vm = this;
            let {zoom, x, y} = vm;
            let isUpdate = false;

            if (newZoom !== zoom) {
                vm.$emit('update:zoom', newZoom);
                isUpdate = true;
            }

            if (newX !== x) {
                vm.$emit('update:x', newX);
                isUpdate = true;
            }

            if (newY !== y) {
                vm.$emit('update:y', newY);
                isUpdate = true;
            }

            if (isUpdate) {
                vm.$emit('changeZoom', {zoom: newZoom, x: newX, y: newY});
            }
        },

        /**
         * 获取有效的缩放点
         * 如果没有指定位置，则以panel的中心点作为缩放点
         * @param position 位置   x,y
         */
        getValidZoomXY(position) {
            const vm = this;
            let {x, y} = position || {};
            let width = 0;
            let height = 0;

            if (!vm.isNumber(x) || !vm.isNumber(y)) {
                ({offsetWidth: width, offsetHeight: height} = vm.$el);
            }

            return {
                x: vm.isNumber(x) ? x : width / 2,
                y: vm.isNumber(y) ? y : height / 2,
            }
        },

        /**
         * 计算缩放差值
         * @param {Boolean} isZoomOut 是否是放大
         */
        calcDiffZoom(isZoomOut) {
            const vm = this;
            let {validZoom} = vm;
            let diff = 0.1;

            if (validZoom < 0.55 && validZoom >= 0.45) {
                diff = isZoomOut ? 0.1  : validZoom * 0.1;
            } else if (validZoom < 0.45) {
                diff = validZoom * 0.1;
            }
            return diff;
        },

        /**
         * 处理带ctrl的滚轮事件, 进行画布缩放
         * @param e
         */
        handleScrollPanel(e) {
            const vm = this;
            let operFn = '';

            if (e.wheelDelta) { // IE/Opera/Chrome
                operFn = e.wheelDelta > 0 ? 'zoomIn' : 'zoomOut';
            } else if (e.detail){ // Firefox
                operFn = e.detail < 0 ? 'zoomIn' : 'zoomOut';
            }

            if (operFn) {
                let {x, y} = this.$el.getBoundingClientRect();
                let {clientX, clientY} = e;

                // 算出鼠标位于panel的位置
                vm[operFn]({x: clientX - x, y: clientY - y});
            }
        },

        /**
         * 是否是点击在画布上
         * @param {Event} e
         */
        isMouseDownOnPanel(e) {
            let classList = Array.from(e.target.classList);
            return classList.includes('common-panel') || classList.includes('common-panel__canvas');
        },

        /**
         * 鼠标左键点击，根据是否可移动处理逻辑
         * @param e
         */
        handleMouseDown(e) {
            const vm = this;
            if (vm.isToMove && vm.isMouseDownOnPanel(e)) {
                e.stopPropagation();

                vm.isMoving = true;
                vm._moveHelper.start(vm.validX, vm.validY, e);
                document.body.style.cursor = 'grabbing';
            }
        },

        /**
         * 画布移动事件
         */
        handleCanvasMoving(data, isFirst, e) {
            const vm = this;
            vm.checkChange(data.x, data.y, vm.validZoom);
        },

        /**
         * 画布移动结束事件
         */
        handleCanvasMoveEnd(data, isMoved, e) {
            const vm = this;
            vm.isMoving = false;
            document.body.style.cursor = '';
        },

        // 以下为对外接口
        /**
         * panel坐标点，转成缩放后的canvas的坐标点
         * @param x
         * @param y
         */
        panelToCanvasView(x, y) {
            const vm = this;
            let {validX, validY} = vm;

            return {x: x - validX, y: y - validY};
        },

        /**
         * 缩放后的canvas的坐标点，转成panel坐标点
         * @param x
         * @param y
         */
        canvasViewToPanel(x, y) {
            const vm = this;
            let {validX, validY} = vm;

            return {x: x + validX, y: y + validY};
        },

        /**
         * canvas原始坐标点转成缩放后的坐标点
         */
        originToView(x, y) {
            const vm = this;
            let {validZoom} = vm;

            return {x: x * validZoom, y: y * validZoom};
        },

        /**
         * canvas缩放后的坐标点转成原始坐标点
         */
        viewToOrigin(x, y) {
            const vm = this;
            let {validZoom} = vm;

            return {x: x / validZoom, y: y / validZoom};
        },

        /**
         * panel坐标点，直接转成canvas原始坐标点
         */
        panelToCanvasOrigin(x, y) {
            const vm = this;
            let {x: viewX, y: viewY} = vm.panelToCanvasView(x, y);
            return vm.viewToOrigin(viewX, viewY);
        },

        /**
         * 进行缩放
         * 先还原成原始比例，再进行缩放，缩放完将缩放后的缩放点挪回对应panel的点
         * @param position 缩放点
         * @param diffZoom 缩放差值
         */
        doZoom(position, diffZoom = 0) {
            const vm = this;
            let zoom = vm.getValidNum(vm.validZoom + diffZoom, vm.zoomRange, 1);
            zoom = +zoom.toFixed(10);

            if (zoom !== vm.validZoom) {
                let {x, y} = vm.getValidZoomXY(position);
                let {x: canvasX, y: canvasY} = vm.panelToCanvasOrigin(x, y);
                let zoomedX = canvasX * zoom;
                let zoomedY = canvasY * zoom;

                vm.checkChange(x - zoomedX, y - zoomedY, zoom);
            }
        },
        /**
         * 缩小
         * @param {Object} position  {x, y} 鼠标放置的位置，以该位置为原点放大
         * x,y 为panel坐标系的xy
         */
        zoomIn(position) {
            const vm = this;
            vm.doZoom(position, -vm.calcDiffZoom());
        },

        /**
         * 放大
         * @param {Object} position  {x, y} 鼠标放置的位置，以该位置为原点放大
         * x,y 为panel坐标系的xy
         */
        zoomOut(position) {
            const vm = this;
            vm.doZoom(position, vm.calcDiffZoom());
        },

        /**
         * 移动距离 传入的距离为缩放后的距离
         * @param {Number} offsetX
         * @param {Number} offsetY
         */
        translate(offsetX = 0, offsetY = 0) {
            const vm = this;

            let x = vm.getValidNum(vm.validX + offsetX, vm.xRange, 0);
            let y = vm.getValidNum(vm.validY + offsetY, vm.xRange, 0);

            vm.checkChange(x, y, vm.validZoom);
        },

        /**
         * 重置缩放数据
         */
        resetZoom() {
            const vm = this;
            let {x, y} = vm.getValidZoomXY();
            let {x: canvasX, y: canvasY} = vm.panelToCanvasOrigin(x, y);

            vm.checkChange(x - canvasX, y - canvasY, 1);
        },

        /**
         * 缩放到合适位置
         * @param area 节点位置
         */
        zoomToFit(area) {
            const vm = this;

            if (area) {
                let {offsetWidth: width, offsetHeight: height} = vm.$el;
                let areaWidth = area.maxX - area.minX;
                let areaHeight = area.maxY - area.minY;
                let xZoom = width / areaWidth;
                let yZoom = height / areaHeight;

                // 因为要所有节点都在视图内，所以要取缩放完视图最小的比例
                let zoom = vm.getValidNum(Math.min(xZoom, yZoom), vm.zoomRange, 1);
                
                // 居中
                let zoomedX = (area.minX + areaWidth / 2) * zoom;
                let zoomedY = (area.minY + areaHeight / 2) * zoom;

                vm.checkChange(width / 2 - zoomedX, height / 2 - zoomedY, zoom);
            }
        }
    },
    beforeCreate() {
        // 增加panelNo序号
        panelNo++;
    },
    created() {
        const vm = this;

        // 生成节流版函数
        vm.handleScrollPanelThrottle = throttle(this.handleScrollPanel, 50);

        vm._moveHelper = new MouseMoveHelper(vm.handleCanvasMoving, vm.handleCanvasMoveEnd, ['click', 'mousewheel']);
        console.log(vm._moveHelper)
    },
    mounted() {
    },
    beforeDestroy() {
        const vm = this;

        vm._moveHelper.destory();
    }
};
