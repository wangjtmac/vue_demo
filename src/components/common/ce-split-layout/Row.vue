<template>
    <div class="Row ce-split_item ce-split_view">
        <template v-if="item.children.length">
            <Row
                    v-for="child in item.children"
                    :key="child.id"
                    :itemId="child.id"
                    :item="child"
                    :dir="child.dir"
                    :data="data"
                    :list-data="item.children"
                    v-on="$listeners"
                    @splitResize="splitResize"
                    :style="{
                        'flex-basis' : child.dir ==='vertical' ? child.row : child.col,
                        'flex-direction' : child.dir ==='vertical' ? 'column' : 'row'
                    }"
            >
                <slot :item="child"></slot>
            </Row>
        </template>
        <Col v-on="$listeners" @splitResize="splitResize" :item="item" :item-id="item.id" :dir="dir" v-else>
            <slot :item="item"></slot>
        </Col>
    </div>
</template>

<script>
import Col from "./Col.vue"
import {resizeMixins} from "@/components/common/ce-split-layout/resizeMixins";

export default {
    name: "Row",
    components: {Col},
    mixins :[resizeMixins],
    props: {
        data:Array,
        item: Object,
        itemId: String,
        dir: {
            type: String,
            default: "vertical",//vertical , horizontal
        },
        listData : Array
    },
    methods: {
        getResizeMethod(dir , params){
            const vm = this;
            let method = {
                bottom : function (){
                    return vm.bottomResize(params);
                },
                top : function (){
                    return vm.topResize(params);
                }
            };
            method[dir] && method[dir]();
        },
        bottomResize({split}){
            const vm = this;
            if(vm.item.dir === 'horizontal'){
                vm.item.row = parseFloat(vm.item.row) + split + 'px';
            }
        },
        topResize({ split }){
            const vm = this , {listData , item} = vm;
            let nodeInx = listData.findIndex(d => d.id === item.id) , next = listData[nodeInx - 1];
            if(item.dir === 'horizontal' && nodeInx > 0 && parseFloat(vm.item.row) - split >= 0 && parseFloat(next.row) + split >= 0 ){
                vm.item.row = parseFloat(vm.item.row) - split + 'px';
                next.row = parseFloat(next.row) + split + 'px';
            }
        },

    }
}
</script>

<style scoped>

</style>
