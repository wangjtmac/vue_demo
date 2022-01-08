<template>
    <div class="sortable">
        <!--        <draggable :list="list" class="sort_group" ghost-class="sort_ghost">
                    <div class="sort_item" v-for="element in list" :key="element.id">
                        {{ element.label }}
                    </div>
                </draggable>-->

        <ce-sortable :data="list" mode="horizontal">
<!--            <div class="sort_item" slot="listItem" slot-scope="{item , id}" :key="id">
                {{ item.label }}
            </div>-->
        </ce-sortable>

    </div>
</template>

<script>
import CeSortable from "@/components/ce-sortable"

export default {
    name: "sortable",
    components: {
        CeSortable

    },
    data() {
        return {
            list: [
                {
                    label: "item1",
                    id: "0",
                },
                {
                    label: "item2",
                    id: "1",
                },
                {
                    label: "item3",
                    id: "2",
                },
            ],
            dragging: false,
            activeNames: "",
        };
    },
    methods: {
        checkMove() {
        },
        handleChange() {
            console.log("changed");
        },
        inputChanged(value) {
            this.activeNames = value;
        },
        getComponentData() {
            return {
                on: {
                    change: this.handleChange,
                    input: this.inputChanged,
                },
                attrs: {
                    wrap: true,
                },
                props: {
                    value: this.activeNames,
                },
            };
        },
    },
};
</script>

<style scoped lang="less">
.sortable {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
}

.sort {
    &_item {
        background: #e1fae3;
        margin: 6px;
        padding: 10px 14px;
        cursor: move;
    }

    &_ghost {
        background: none;
        border: 1px dashed #aaa;
        padding: 9px 12px;
    }
}
</style>
