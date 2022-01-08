/**
 * 鼠标移动计算偏移量辅助器
 * @Author: zhanbh
 * @Date: 2020-11-11
 * @Project mist-web-vue
 */
export default class MouseMoveHelper {

    /**
     * 辅助器构造函数
     *
     * @param onMoving 鼠标移动时的回调
     * @param onEnd 移动停止使得回调
     * @param stopEventNames  需要全局阻止的事件 如click
     * @param DOM 全局dom对象
     */
    constructor(onMoving, onEnd, stopEventNames, DOM) {
        this._startValueX = NaN;
        this._startValueY = NaN;

        this._startMouseX = NaN;
        this._startMouseY = NaN;

        this._isMoving = false;

        this._stopEventNames = this._getValidStopEventNames(stopEventNames);

        this._handlers = {};

        this._onMoving = onMoving; // onMoving({x,y,offsetX,offsetY}, isFirst: 是否是第一次移动, e): boolean
        this._onEnd = onEnd; // onEnd({x,y,offsetX,offsetY}, isMoved: 是否只是移动过一次, e)

        this._DOM = DOM || document;

        this.zoom = 1; // 缩放比例
    }

    /**
     * 全局初始化 事件
     * @private
     */
    _initDOMMouseEvent() {
        const self = this;

        // 需要生成一个新的函数，不然不同实例解绑会相互影响
        self._handlers.mousemove = self._handleDOMMouseMove.bind(self);
        self._handlers.mouseup = self._handleDOMMouseUp.bind(self);

        self._DOM.addEventListener('mousemove', self._handlers.mousemove, true);
        self._DOM.addEventListener('mouseup', self._handlers.mouseup, true);
    }

    /**
     * 移除全局的事件
     * @private
     */
    _removeDOMMouseEvent() {
        const self = this;
        self._DOM.removeEventListener('mousemove', self._handlers.mousemove, true);
        self._DOM.removeEventListener('mouseup', self._handlers.mouseup, true);

        self._handlers.mousemove = null;
        self._handlers.mouseup = null;

        // 延迟摧毁禁用的事件，使其可以禁用随后马上触发的事件，如click
        window.setTimeout(() => {
            self._removeDOMStopEvents();
        }, 0);
    }

    /**
     * 初始化需要禁用的全局事件
     * @private
     */
    _initDOMStopEvents() {
        const self = this;

        self._stopEventNames.forEach(name => {

            if (!(self._handlers[name] instanceof Function)) {
                self._handlers[name] = self._handleStopEvent.bind(self);
                self._DOM.addEventListener(name, self._handlers[name], true);
            }
        });
    }

    _removeDOMStopEvents() {
        const self = this;

        self._stopEventNames.forEach(name => {
            self._DOM.removeEventListener(name, self._handlers[name], true);
            delete self._handlers[name];
        });
    }

    /**
     * 过滤非法的事件名称 
     * @param events 事件名称集合
     * @returns {*}
     * @private
     */
    _getValidStopEventNames(events) {
        if (Array.isArray(events) && events.length > 0) {
            return events.filter(item => typeof item === 'string' && item.trim() !== '');
        } else {
            return [];
        }
    }

    /**
     * 禁止事件传播
     * @param e
     * @private
     */
    _handleStopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * 鼠标移动
     * @private
     */
    _handleDOMMouseMove(e) {
        const self = this;
        let xyData = self.getXYByMouseEvent(e);

        // 第一次没做有效的移动就不执行 不然点击永远触发不了
        if (!self._isMoving && !self.isValidMove(xyData.originOffsetX, xyData.originOffsetY)) {
            return false;
        }

        let canContinue = true;
        if (self._onMoving instanceof Function) {
            canContinue = self._onMoving(xyData, !self._isMoving, e);  // 传递事件是因为需要由回调进行自定义处理
        }

        if (canContinue !== false) {
            if (!self._isMoving) {
                self._isMoving = true;
                self._initDOMStopEvents();
            }
        } else {
            self._handleDOMMouseUp(e);
        }
    }

    /**
     * 放开鼠标，则移动结束
     * @param e
     * @private
     */
    _handleDOMMouseUp(e) {
        const self = this;
        let xyData = self.getXYByMouseEvent(e);

        if (self._onEnd instanceof Function) {
            self._onEnd(xyData, self._isMoving, e);  // 传递事件是因为需要由回调进行自定义处理
        }

        self.stop();
    }

    /**
     * 根据鼠标事件对象获取xy的数据信息
     * @param e
     * @returns {*}
     */
    getXYByMouseEvent(e) {
        const self = this;
        
        if (!e) {
            throw new Error('mouse event object is require');
        }

        let originOffsetX = e.clientX - self._startMouseX;
        let originOffsetY = e.clientY - self._startMouseY;

        let offsetX = originOffsetX / self.zoom;
        let offsetY = originOffsetY / self.zoom;
        
        return {
            startX: self._startValueX,
            startY: self._startValueY,
            x: self._startValueX + offsetX,
            y: self._startValueY + offsetY,
            offsetX,
            offsetY,
            originOffsetX,
            originOffsetY
        }
    }
    
    /**
     * 判断是否使有效的移动
     * @param offsetX
     * @param offsetY
     * @returns {boolean}
     */
    isValidMove(offsetX = 0, offsetY = 0) {
        return Math.abs(offsetX) > 2 || Math.abs(offsetY) > 2;
    }

    /**
     * 更新需要禁用的事件
     */
    updateStopEventNames(stopEventNames) {
        const self = this;

        if (self._isMoving) {
            self._removeDOMStopEvents();
        }

        self._stopEventNames = stopEventNames;

        if (self._isMoving) {
            self._initDOMStopEvents();
        }
    }

    /**
     * 设置缩放比例
     * @param {zoom} zoom 必须是大于0的数
     */
    setZoom(zoom) {
        const self = this;
        self.zoom =  zoom > 0 ? zoom : 1;
    }

    /**
     * 开始启动
     * @param {Number} valueX
     * @param {Number} valueY
     * @param {Event} event
     */
    start(valueX, valueY, event) {
        const self = this;

        if (!event) {
            throw new Error('MouseMoveHelper.start(): MouseEvent is required!');
        }

        self._startValueX = valueX;
        self._startValueY = valueY;
        self._startMouseX = event.clientX;
        self._startMouseY = event.clientY;
        self._isMoving = false;

        self._initDOMMouseEvent();
    }

    /**
     * 单纯的结束，不会执行onEnd回调
     */
    stop() {
        const self = this;

        self._startValueX = NaN;
        self._startValueY = NaN;
        self._startMouseX = NaN;
        self._startMouseY = NaN;

        self._removeDOMMouseEvent();
    }

    /**
     * 摧毁辅助器，摧毁后就不能再用了
     */
    destory() {
        const self = this;
        self.stop();

        let timer = window.setTimeout(() => {
            window.clearTimeout(timer);
            self._onMoving = null;
            self._onEnd = null;
            self._DOM = null;
            self._stopEventNames = null;
            self._handlers = null;
        }, 1)
    }
}