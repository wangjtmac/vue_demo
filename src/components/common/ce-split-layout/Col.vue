<template>
    <div class="Col ce-split_cont"
         @mousedown="viewDragStart"
         :class="{'active' : !!dragTarget , 'ce-split_sparse': state.size === 'large' }">
        <div class="full_panel ovh">
            <slot></slot>
        </div>
        <div class="ce-split_left ce-handle_resize"
             @mousedown="bindDragTarget($event , item , 'left')">
            <em class="ce-split_resize"></em></div>
        <div class="ce-split_right ce-handle_resize"
             @mousedown="bindDragTarget($event , item , 'right')"
        ><em class="ce-split_resize"></em></div>
        <div class="ce-split_top ce-handle_resize"
             @mousedown="bindDragTarget($event , item , 'top')"
        ><em class="ce-split_resize"></em></div>
        <div class="ce-split_bottom ce-handle_resize"
             @mousedown="bindDragTarget($event , item , 'bottom')"
        ><em class="ce-split_resize"></em></div>
        <div ref="drag"
             v-if="!!(drag && drag.offset)"
             class="hide"
             :style="{
                'transform' :`scale(${drag.offset.sx} , ${drag.offset.sy})`
              }"
        ></div>
        <div class="preview ce-split_preview" ref="preview">
            <div class="ce-upper" v-if="showUpper"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: "Col",
    props: {
        item: Object,
        itemId: String,
        dir: String
    },
    data() {
        return {
            dragTarget: null,
            state: {
                resizing: false,
                size: "small",// large,small
            },
            drag: null,
            amountSize: .5,//
            showUpper : false
        }
    },
    computed: {
        distance() {
            return this.state.size === 'small' ? 8 : 12;
        }
    },
    methods: {
        /**
         * 绑定改变大小事件
         * @param e
         * @param item
         * @param dir
         */
        bindDragTarget(e, item, dir) {
            const vm = this, {itemId} = vm;
            let event = e || window.event;
            vm.dragTarget = item;
            event.stopPropagation();
            event.preventDefault();
            vm.state.resizing = true;
            const drag = (event) => {
                if (event.button !== 0) return;
                let {clientWidth, clientHeight} = vm.$el.parentNode;
                let {offsetLeft, offsetTop} = vm.$el.parentNode;
                let parentRect = vm.getParentRect();
                let splitSize = vm.countSize(event, dir, parentRect, clientWidth, clientHeight, offsetLeft, offsetTop);
                vm.$emit('splitResize', event, itemId, splitSize, dir);
            }
            const drop = (event) => {
                if (event.button !== 0) return;
                vm.state.resizing = false;
                vm.dragTarget = null;
                document.removeEventListener('mousemove', drag)
                document.removeEventListener('mouseup', drop)
            }
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', drop)
        },
        getParentRect() {
            const vm = this;
            let parentNode = vm.$el;
            while (parentNode.dataset.id !== 'split') {
                parentNode = parentNode.parentNode;
            }
            return parentNode.getBoundingClientRect();
        },
        /**
         * 计算拖拽变化大小
         * @param event
         * @param dir
         * @param parentRect
         * @param clientWidth
         * @param clientHeight
         * @param offsetLeft
         * @param offsetTop
         * @return {*}
         */
        countSize(event, dir, parentRect, clientWidth, clientHeight, offsetLeft, offsetTop) {
            let {distance} = this;
            let len = {
                left: function () {
                    return ((event.x - parentRect.left - offsetLeft - distance) / parentRect.width) * 100;
                },
                right: function () {
                    return ((event.x - parentRect.left - clientWidth - offsetLeft + distance) / parentRect.width) * 100;
                },
                bottom: function () {
                    return event.y - parentRect.top - clientHeight - offsetTop + distance;
                },
                top: function () {
                    return event.y - parentRect.top - offsetTop - distance / 2;
                }
            };
            return len[dir]();
        },
        viewDragStart(e) {
            const vm = this, {item, drag} = vm;
            // let drag_o = drag ? JSON.parse(JSON.stringify(drag)) : drag;
            if (e.button !== 0) return;
            let el = e.target;
            e.preventDefault();
            e.stopPropagation();
            const tract = el.getBoundingClientRect();
            let view = vm.$el.cloneNode(true);
            view.style.width = "100%";
            view.style.height = "100%";
            let nw = 100, nh = 80, sx = nw / tract.width, sy = nh / tract.height;
            vm.drag = {
                ...drag,
                view,
                node: item,
                offset: {
                    sx, sy,
                    nw, nh,
                    w: tract.width,
                    h: tract.height
                }
            }
            vm.$nextTick(() => {
                vm.$refs.drag.style.width = tract.width + 'px';
                vm.$refs.drag.style.height = tract.height + 'px';
            })
            document.addEventListener('mousemove', vm.viewDrag);
            document.addEventListener('mouseup', vm.viewDrop);
        },
        viewDrag(e) {
            const vm = this, {offset} = vm.drag;
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            if (!vm.$refs.drag.innerHTML) {
                vm.$refs.drag.appendChild(vm.drag.view);
            }
            const rel = {
                x: e.clientX - offset.w * (1 - offset.sx) / 2 + 7,
                y: e.clientY - offset.h * (1 - offset.sy) / 2 + 7
            };
            vm.$refs.drag.style.top = `${rel.y}px`;
            vm.$refs.drag.style.left = `${rel.x}px`;
            vm.$refs.drag.className = "dragView";
            document.body.style.cursor = "move";
            vm.viewOver(e);
        },
        viewOver(e) {
            const vm = this, {checkAttach} = vm;
            let viewDom = document.elementFromPoint(e.clientX, e.clientY);
            for (; viewDom && viewDom.matches && !viewDom.matches('.ce-split_view');) {
                if (viewDom.matches('.ce-split_preview')) {
                    viewDom = vm.drag.over.viewDom;
                }else if(viewDom.matches('.ce-upper')){
                    vm.showUpper = false;
                    viewDom = vm.drag.over.viewDom.parentNode;
                }else {
                    viewDom = viewDom.parentNode;
                }
            }
            if (!viewDom || !viewDom.matches) {
                vm.previewPane(-1);
                return;
            }
            let {minI, min} = checkAttach(viewDom, e);

            let attach = minI;
            if (attach !== -1) {
                vm.drag.over = {viewDom, attach};
            }
            vm.previewPane(attach, viewDom , min);
        },
        checkAttach(targetDom, e) {
            let size = this.amountSize;
            let tract = targetDom.getBoundingClientRect(),
                    tW = tract.width * size,
                    tH = tract.height * size,
                    rPos = {x: e.clientX - tract.left, y: e.clientY - tract.top};
            // 计算距离并检查最近的距离
            let pos = [
                (rPos.y - tH) / tH, //top
                ((tract.width - tW) - rPos.x) / tW, //right
                ((tract.height - tH) - rPos.y) / tH, //bottom
                (rPos.x - tW) / tW //left
            ], min = 0, minI = -1 , dis = 0;
            // 仅当小于0时匹配
            pos.forEach((v, i) => {
                if (v < min) {
                    min = v;
                    minI = i;
                }
            })
            return {minI, min};
        },
        viewDrop(e) {
            if (e.button !== 0) return;
            document.removeEventListener('mousemove', this.viewDrag);
            document.removeEventListener('mouseup', this.viewDrop);
            this.$refs.drag.className = "hide";
            this.previewPane(-1);
            this.drag = null;
            document.body.style.cursor = "";
        },
        previewPane(attach, targetDom , minD) {
            const vm = this, {distance} = vm;
            if (attach === -1) {
                this.$refs.preview.style = {};
                this.$refs.preview.style.opacity = 0;
                return;
            }
            if (targetDom === undefined) return -1;
            let size = this.amountSize;
            const targetRect = targetDom.getBoundingClientRect();
            const previewPos = {
                left: targetRect.left + distance,
                top: targetRect.top + distance,
                width: targetRect.width - 2 * distance,
                height: targetRect.height - 2 * distance
            }
            if (attach === 1) {
                previewPos.left += previewPos.width - previewPos.width * size;
            } else if (attach === 2) {
                previewPos.top += previewPos.height - previewPos.height * size;
            }
            let len;
            if ((attach % 2) === 0) {
                previewPos.height *= size;
                len = previewPos.height * (1 + minD);
            } else if ((attach % 2) === 1) {
                previewPos.width *= size;
                len = previewPos.width * (1 + minD);
            }
            vm.$refs.preview.style.opacity = 1;
            vm.$refs.preview.style.position = 'fixed';
            for (const k in previewPos) {
                vm.$refs.preview.style[k] = previewPos[k] + 'px';
            }
            vm.setUpperPos(attach , len);

        },
        async setUpperPos(attach , len) {
            const vm = this;
            if( len >= 40  && len <= 45) {
                vm.showUpper = true;
            }
            await vm.$nextTick();
            let upperNode = vm.$refs.preview.children[0];
            if(!upperNode) return;
            upperNode.style = {};
            upperNode.style.width = '100%';
            upperNode.style.height = '100%';
            upperNode.style.top = 0;
            upperNode.style.left = 0;
            let upperFn = [
                function () {
                    upperNode.style.height = '8px';
                },
                function () {
                    upperNode.style.left = 'auto';
                    upperNode.style.right = 0;
                    upperNode.style.width = '8px';
                },
                function () {
                    upperNode.style.bottom = 0;
                    upperNode.style.top = 'auto';
                    upperNode.style.height = '8px';
                },
                function () {
                    upperNode.style.width = '8px';
                }
            ];
            upperFn[attach]();
        }
    }
}
</script>

<style scoped>
.hide {
    display: none;
}

.dragView {
    position: fixed;
    z-index: 3100;
    box-shadow: 0 0 10px 8px rgba(0, 0, 0, .1);
    cursor: move;
}
</style>
