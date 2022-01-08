<!--
    拖拽插件，支持拖拽多个
    slot ： listItem 建议自定义时，使用内联标签 如 span , em , i
    props :
        data 选项数组
        mode
-->

<template>
    <div class="ce-draggable">
        <div class="ce-draggable_setting" v-if="multiple">
            <el-checkbox class="ce-check-all" :indeterminate="isIndeterminate" v-model="checkAll"
                         @change="handleCheckAllChange">{{ checkAllTxt }}
            </el-checkbox>
        </div>
        <div class="ce-draggable_cont" :class="{'ce-draggable_mul' : multiple}" ref="list">
            <el-checkbox-group v-model="checkAllItems" @change="checkedItemsChange" v-if="multiple">
                <el-checkbox
                        :class="{'ce-vertical_check' : mode === 'vertical' , 'ce-horizontal_check' : mode === 'horizontal'}"
                        v-for="(item , k) in data"
                        :label="item.value" :key="k">
                    <div class="ce-draggable_item">
                        <slot name="listItem" :item="item" :$index="k">
                            <span :title="item.label">{{ item.label }}</span>
                        </slot>
                    </div>
                </el-checkbox>
            </el-checkbox-group>
            <ul v-else>
                <li class="ce-draggable_item ce-draggable_li"
                    v-for="(item , k) in data"
                    :key="k"
                    :data-value="item.value">
                    <slot name="listItem" :item="item" :$index="k">
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
            default: "vertical",//horizontal
        },
        checkAllTxt: {
            type: String,
            default: "全选"
        },
        multiple: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isIndeterminate: false,
            checkAll: false,
            checkAllItems: []
        }
    },
    methods: {
        handleCheckAllChange(val) {
            const vm = this, {data} = vm;
            vm.checkAllItems = val ? data.map(da => da.value) : [];
            vm.isIndeterminate = false;
        },
        checkedItemsChange(val) {
            let checkedCount = val.length;
            this.checkAll = checkedCount === this.data.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;
        },
        bindDraggable() {
            const vm = this, {getCheckedDom, multiple, getSingleDom , getCheckItem} = vm;
            if (multiple) {
                $(vm.$refs.list).draggable({
                    addClasses: false,
                    appendTo: "body",
                    cursor: "move",
                    zIndex: 120,
                    cursorAt: {right: 0, top: 0},
                    helper: function () {
                        return getCheckedDom();
                    },
                })
            } else {
                $(".ce-draggable .ce-draggable_li").draggable({
                    addClasses: false,
                    appendTo: "body",
                    cursor: "move",
                    zIndex: 120,
                    cursorAt: {right: 0, top: 0},
                    helper: function (e) {
                        return getSingleDom(e);
                    },
                    start : function (e){
                        getCheckItem(e);
                    }
                })
            }

        },
        getSingleDom(e) {
            const vm = this, {getItems} = vm;
            let code = e.currentTarget.dataset.value,
                dragItem = getItems([code]);
            let dom = document.createElement('div');
            dom.className = "p10 bgwh ce-shadow";
            return vm.setChildDom(dragItem , dom);
        },
        getCheckedDom() {
            const vm = this, {checkAllItems, getItems, $message} = vm;
            let checkedItems = getItems(checkAllItems);
            let dom = document.createElement('div');
            if (checkedItems.length) dom.className = "p10 bgwh ce-shadow";
            else $message.warning("请选择拖拽项");
            return vm.setChildDom(checkedItems , dom);
        },
        setChildDom(checkedItems , dom){
            checkedItems.forEach(item => {
                let li = document.createElement('li');
                li.className = 'ell w200 lh24 g5';
                li.innerText = item.label;
                dom.appendChild(li);
            });
            return $(dom);
        },
        /**
         * 获取拖拽项的数据
         * @param val
         * @return {*}
         */
        getItems(val) {
            const vm = this, {data} = vm;
            return data.filter(li => val.includes(li.value));
        },
        /**
         * 传递 单个 拖拽项数据
         * @param e
         */
        getCheckItem(e){
            const vm = this, {getItems} = vm;
            let code = e.currentTarget.dataset.value,
                dragItem = getItems([code]);
            vm.$emit("dragItems", dragItem);
        }
    },
    watch: {
        /**
         * 多个拖拽的数据
         * @param val
         */
        checkAllItems(val) {
            let checkedItems = this.getItems(val);
            this.$emit("dragItems", checkedItems);
        }
    },
    mounted() {
        this.bindDraggable()
    }
}
</script>

<style scoped lang="less">
.ce {
    &-vertical_check.el-checkbox {
        display: block;
        margin: 0;
        width: 100%;

        /deep/ .el-checkbox__label {
            width: calc(100% - 24px);
        }
    }

    &-horizontal_check {
        max-width: 200px;

        /deep/ .el-checkbox__label {
            width: calc(100% - 24px);
        }
    }

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

}
</style>
<style>
.ce-shadow {
    box-shadow: 0 1px 3px 3px rgba(0, 0, 0, .1);
}
</style>
