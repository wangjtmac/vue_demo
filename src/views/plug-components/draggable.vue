<template>
    <div class="draggable">
        <div class="draggable_left">
            <ce-drag-list :data="list"
                          :multiple="true"
                          drag-item-class-name="list-li"
                          @dragItems="dragItems">
                <template slot="listItem" slot-scope="{item , $index , className }">
                    <div class="list-li" :class="className" :title="item.label">
                        {{ item.label }}
                    </div>
                </template>
            </ce-drag-list>
        </div>
        <div class="draggable_right"></div>
    </div>
</template>

<script>
import CeDraggable from "@/components/ce-draggable"
import CeDragList from "@/components/CeDragList";

export default {
    name: "draggable",
    components: {
        CeDraggable,
        CeDragList
    },
    data() {
        return {
            list: [
                {
                    label: "关键字段关键字段关键字段关键字段关键字段关键字段关键字段",
                    value: "keyNode"
                }, {
                    label: "年龄",
                    value: "age"
                }, {
                    label: "数量",
                    value: "count"
                },
            ]
        }
    },
    methods: {
        dragItems(data) {
            console.log(data)
        }
    },

}
</script>

<style scoped lang="less">
.draggable {
    height: 100%;
    display: flex;

    &_left {
        width: 300px;
        padding: 20px;
        overflow: auto;
        box-sizing: border-box;
        border-right: 1px solid #ddd;
    }

    &_right {
        flex: 1;
    }
}


</style>
<style lang="less">
.list-li {
    padding:0 10px;
    color: #1e98de;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        background: #1e98de70;
        color: #fff;
    }

    &.active {
        background: #1e98de;
        color: #fff;
    }
}
</style>
