<template>
    <div class="dashboard">
        <!-- 左侧列表 -->
        <div class="left-menu">
            <ul>
                <li
                        v-for="(item,index) in pluginList"
                        :draggable="true"
                        :key="index"
                        @dragstart="drag($event , item)"
                >{{ item.label }}
                </li>
            </ul>
            <div class="tc mt20">
                <el-radio-group  v-model="panelS">
                    <el-radio-button v-for="btn in sizeOpt" :key="btn.value" :label="btn.value">{{btn.label}}</el-radio-button>
                </el-radio-group>
            </div>

        </div>
        <div class="canvas-content" @dragover="allowDrop"
             @drop="drop">
            <ce-split-layout :data="data" :layoutSty="layoutSty">
               <template slot-scope="{item}">
                   <item :title="item.label" :item="item"></item>
               </template>
            </ce-split-layout>
        </div>
    </div>
</template>

<script>

import Item from './Item'
import {CeSplitLayout} from '@/components/common/ce-split-layout'

export default {
    name: "dashboardDemo",
    components: {
        Item,
        CeSplitLayout
    },
    data() {
        return {
            pluginList: [
                {label: "碰撞", keyWord: "unionJoinPlugin"},
                {label: "输入", keyWord: "inputMeta"},
                {label: "关系库", keyWord: "labelMeta"},
                {label: "全文", keyWord: "kVOutput"},
                {label: "柱状", keyWord: "gpOut"},
                {label: "折线", keyWord: "csvOutput"},
            ],
            tree: {
                dir: "horizontal",
                first: "0",
                split: "100%",
                second: ""
            },
            curItem: null,
            data: [
                {
                    label: "123",
                    id: "0",
                    col: "100%",
                    row: "200px",
                    dir:"horizontal",
                    children : []
                }, {
                    label: "4",
                    id: "1",
                    col: "100%",
                    row: "200px",
                    dir:"horizontal",
                    children : [
                        {
                            label: "5",
                            id: "2",
                            pId : "1",
                            col: "30%",
                            row: "200px",
                            dir:"horizontal",
                            children : []
                        },{
                            label: "6",
                            id: "3",
                            pId : "1",
                            col: "40%",
                            row: "200px",
                            dir:"horizontal",
                            children : []
                        },{
                            label: "7",
                            id: "4",
                            pId : "1",
                            col: "30%",
                            row: "200px",
                            dir:"horizontal",
                            children : []
                        },
                    ]
                },
                {
                    label: "7",
                    id: "8",
                    col: "100%",
                    row: "200px",
                    dir:"horizontal",
                    children : [
                        {
                            label: "7",
                            id: "5",
                            pId : "8",
                            col: "50%",
                            row: "200px",
                            dir:"horizontal",
                            children : []
                        },
                        {
                            label: "7",
                            id: "6",
                            pId : "8",
                            col: "50%",
                            row: "200px",
                            dir:"horizontal",
                            children : []
                        },
                    ]
                },
            ],
            layoutSty: {
                height: "auto"
            },
            sizeOpt : [
                {
                    value:"autoW" ,
                    label : "宽度适应"
                },{
                    value:"pctH" ,
                    label : "高度适应"
                },
            ],
            panelS : "autoW"
        }
    },
    methods: {
        layoutType(type, width, height) {
            const vm = this , {data} = vm;
            let layoutStrategy = {
                autoW: function () {//宽度适应
                    vm.layoutSty = {
                        height: "auto"
                    };
                },
                pctH : function (){//高度适应
                    vm.layoutSty = {
                        height : "100%"
                    };
                },
                customH : function (){ //自定义
                    vm.layoutSty = {
                        width,
                        height
                    };
                },

            };
            return layoutStrategy[type]();
        },
        allowDrop(e) {
            return e.preventDefault();
        },
        drop(e) {

        },
        onSplitResize(data) {

        },
        //拖拽开始事件
        drag(evt, item) {
            this.curItem = item;
        },
    },
}
</script>

<style scoped>
.dashboard {
    height: 100%;
    display: flex;
}

.left-menu {
    min-width: 300px;
    height: 100%;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
}

.left-menu li {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    cursor: move;
}

.canvas-content {
    flex: 1;
    background: #edeeef;
    position: relative;
    overflow: auto;
}
</style>
