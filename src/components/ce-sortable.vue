<!-- 
 * 拖拽排序
    slot : listItem 自定义 拖拽项
    props : data 拖拽项 数据
    mode : 布局  横/竖
    ghostClass : 拖拽时的 占位样式
 -->
<template>
    <draggable :list="data" class="sort-list"
               :class="mode === 'vertical'? 'sort-list_vertical' : 'sort-list_horizontal'"
               :ghost-class="ghostClass">
        <template v-for="item in data">
            <slot name="listItem" :item="item"  :id="item.id">
                <div class="sort-list_item">{{ item.label }}</div>
            </slot>
        </template>
    </draggable>
</template>

<script>
import draggable from "vuedraggable";
export default {
    name : "CeSortable",
    components: {
        draggable
    },
    props : {
        data : {
            type : Array,
            default : () => []
        },
        mode: {
            type: String,
            default: "vertical",//horizontal
        },
        ghostClass : {
            type : String ,
            default : "sort-list_ghost"
        }
    },

}
</script>

<style lang="less" scoped>
    .sort-list {
        overflow: hidden;
        display: flex;
        flex-wrap:wrap;
        &_vertical {
            flex-direction: column;
        }
        &_horizontal {
            flex-direction: row;
        }
        &_item {
            background: #e1fae3;
            padding:0 14px;
            margin:6px;
            line-height: 30px;
            max-width:200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: move;
        }
        &_ghost {
            background: none;
            border: 1px dashed #aaa;
        }
    }
    
</style>

