<!--
    拖拽插件，支持拖拽多个
    slot ： listItem 建议自定义时，使用内联标签 如 span , em , i
    props :
        data 选项数组
        mode
-->

<template>
    <div class="ce-draggable">
        <div class="ce-draggable_setting" v-if="showCheckAll">
            <el-checkbox class="ce-check-all" :indeterminate="isIndeterminate" v-model="checkAll"
                         @change="handleCheckAllChange">{{ checkAllTxt }}
            </el-checkbox>
        </div>
        <div class="ce-draggable_cont" :class="{'ce-draggable_mul' : showCheckAll}"
             v-click-out="clearFocus"
             ref="list">
            <ul>
                <li class="ce-draggable_item ce-draggable_li"
                    :class="{'ce-vertical_check' : mode === 'vertical' , 'ce-horizontal_check' : mode === 'horizontal'}"
                    v-for="(item , k) in data"
                    :key="k"
                    @mousedown="setDragItem($event , item , k , 'checkAllItems')"
                    @click="triggerItem($event , item , k)"
                    :data-value="item.value">
                    <slot name="listItem" :item="item"
                          :$index="k"
                          :className="isCheckedData(item , checkAllItems) ? focusClassName : ''"
                    >
                        <span :title="item.label">{{ item.label }}</span>
                    </slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import * as $ from "jquery"
import 'jquery-ui-dist/jquery-ui'
import 'jquery-ui-dist/jquery-ui.min.css'

export default {
    name: "CeDraggable",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        mode: {
            type: String,
            default: "vertical",//horizontal , vertical
        },
        checkAllTxt: {
            type: String,
            default: "全选"
        },
        multiple: {
            type: Boolean,
            default: true
        },
        showCheckAll :{
            type: Boolean,
            default: false
        },
        dragItemClassName : { //拖拽 显示 item dom 样式
            type : String ,
            default : ""
        },
        focusClassName : {
            type : String ,
            default : "active"
        }
    },
    data() {
        return {
            isIndeterminate: false,
            checkAll: false,
            checkAllItems: [],
            shiftStart : null
        }
    },
    methods: {
        /**
         * 清空选择
         */
        clearFocus() {
            this.checkAllItems = [];
            this.shiftStart = null;
        },
        /**
         *
         * @return {boolean}
         */
        isCheckedData(item, data) {
            return data.map(fo => fo.value).includes(item.value);
        },
        setDragItem(e , item , inx){
            const vm = this;
            let {checkAllItems} = vm;
            let itemIds = checkAllItems.map(it => it.value);
            if(e.ctrlKey || e.shiftKey) return;
            if (!checkAllItems.length || !itemIds.includes(item.value)) {
                vm.checkAllItems = [];
                vm.shiftStart = {...item, inx};
                vm.checkAllItems = [item];
            }
        },
        triggerItem(e , item , inx){
            const vm = this;
            if (e.ctrlKey) {
                vm.ctrlClickForField(item, inx);
            } else if (e.shiftKey) {
                vm.shiftClickForField(item, inx);
            } else {
                vm.shiftStart = {...item, inx};
                vm.checkAllItems = [item];
            }
        },
        ctrlClickForField(item, inx){
            const vm = this, {checkAllItems , isCheckedData} = vm;
            vm.shiftStart = {...item, inx};
            if (isCheckedData(item, checkAllItems)) {
                vm.checkAllItems = checkAllItems.filter(fo => fo.value !== item.value);
            } else {
                vm.checkAllItems.push(item);
            }
        },
        shiftClickForField(item, inx){
            const vm = this, {shiftStart,data} = vm;
            if (!shiftStart) {
                vm.shiftStart = {...item, inx};
                vm.checkAllItems.push(item);
            } else {
                vm.checkAllItems = data.filter((da, i) => {
                    let staI = shiftStart.inx, endI = inx;
                    return staI > endI ? (i >= endI && i <= staI) : (i <= endI && i >= staI);
                });
            }
        },
        handleCheckAllChange(val) {
            const vm = this, {data} = vm;
            vm.checkAllItems = val ? data : [];
            vm.isIndeterminate = false;
        },
        /**
         * 单个改变时触发
         * @param val
         */
        checkedItemsChange(val) {
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.data.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
        },
        /**
         * 绑定拖拽事件
         */
        bindDraggable() {
            const vm = this, {getCheckedDom} = vm;
            $(vm.$refs.list).draggable({
                addClasses: false,
                appendTo: "body",
                cursor: "move",
                zIndex: 3000,
                cursorAt: {left: 0, top: 0},
                helper: function () {
                    return getCheckedDom();
                },
                start: function (e) {
                    let {checkAllItems} = vm;
                    vm.$emit("dragItems", checkAllItems);
                },
                stop: function (e) {
                    vm.$emit("dragOff");
                },
            })

        },
        /**
         * 构建 拖拽显示的DOM
         * @return {jQuery|HTMLElement}
         */
        getCheckedDom() {
            const vm = this, {checkAllItems, getItems ,dragItemClassName} = vm;
            let dom = document.createElement('div');
            if(checkAllItems)dom.className = "p10 bgwh ce-shadow";
            return vm.setChildDom(checkAllItems , dom , dragItemClassName);
        },
        /**
         * 设置单个DOM
         * @param checkedItems
         * @param dom
         * @param dragItemClassName
         * @return {jQuery|HTMLElement|*}
         */
        setChildDom(checkedItems , dom , dragItemClassName){
            checkedItems.forEach(item => {
                let li = document.createElement('li');
                li.className = `ell w200 lh24 g5 ${dragItemClassName}`;
                li.innerText = item.label;
                dom.appendChild(li);
            });
            return $(dom);
        },
    },
    mounted() {
        this.bindDraggable()
    }
}
</script>

<style scoped lang="less">
.ce {


    &-check-all {
        line-height: 40px;
    }

    &-draggable {
        height: 100%;

        &_item {
            display: inline-block;
            vertical-align: middle;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            cursor: move;
        }

        &_li:hover {

        }

        &_settings {

        }
        &_cont {
            height: 100%;
            overflow: auto;
        }

        &_mul {
            height: calc(100% - 40px);
        }
    }
    &-vertical_check {
        display: block;
        margin: 0;
        width: calc(100% - 24px);
    }

    &-horizontal_check {
        display: inline-block;
        max-width: 200px;
        width: auto;
        margin:0 6px 6px 0;
    }

}
</style>
<style>
.ce-shadow {
    box-shadow: 0 1px 3px 3px rgba(0, 0, 0, .1);
}
</style>
