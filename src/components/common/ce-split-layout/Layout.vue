<template>
    <ul ref="container" data-id="split" class="ce-split ce-split_view" :style="splitSty">
        <Row
                v-for="item in data"
                :key="item.id"
                :itemId="item.id"
                :item="item"
                :data="data"
                :list-data="data"
                dir="vertical"
                :style="{
                'flex-basis' : item.row ,
                'flex-direction' : 'row'
            }"
                @splitResize="splitResize"
        >
            <slot slot-scope="scope" v-bind="scope"></slot>
        </Row>
    </ul>
</template>

<script>
import Split from "@/components/common/ce-split-layout/Split";
import Row from "./Row.vue"
import Col from "./Col.vue"
import "./layout.less"
import {resizeMixins} from "@/components/common/ce-split-layout/resizeMixins";

export default {
    name: "Layout",
    mixins :[resizeMixins],
    components: {
        Split,
        Row,
        Col
    },
    props: {
        'data': {
            type: Array,
            default: () => []
        },
        layoutSty: {
            type: Object,
            default: ()=>{}
        }
    },
    data() {
        return {
            splitSty : {}
        }
    },
    watch: {
        layoutSty : {
            handler(){
                this.initHeight();
            },
            deep : true
        }
    },
    methods: {
        initHeight(){
            const vm = this , {layoutSty} = vm;
            let layoutH = vm.$refs.container.clientHeight;
            if(layoutSty.height === 'auto'){
                vm.splitSty = {
                    height : layoutH + 'px'
                };
            }else {
                vm.splitSty = layoutSty;
            }

        },
        getResizeMethod(dir , params){
            const vm = this;
            let method = {
                right : function (){
                    return vm.rightResize(params);
                },
                left : function (){
                    return vm.leftResize(params);
                },
                bottom : function (){
                    return vm.bottomResize(params);
                },
                top : function (){
                    return vm.topResize(params);
                }
            };
            method[dir] && method[dir]();
        },

        rightResize({node, nodeInx, data, split}){
            let next = nodeInx + 1;
            if (nodeInx < data.length - 1 && parseFloat(node.col) + split >= 0 && parseFloat(data[next].col) - split >= 0) {
                node.col = parseFloat(node.col) + split + '%';
                data[next].col = parseFloat(data[next].col) - split + '%';
            }
        },
        leftResize({node, nodeInx, data, split}){
            let next = nodeInx - 1;
            if (nodeInx > 0 && parseFloat(node.col) - split >= 0 && parseFloat(data[next].col) + split >= 0) {
                node.col = parseFloat(node.col) - split + '%';
                data[next].col = parseFloat(data[next].col) + split + '%';
            }
        },
        bottomResize({split}){
            const vm = this , {layoutSty} = vm;
            if(layoutSty.height === 'auto'){
                vm.splitSty.height = parseFloat(vm.splitSty.height) + split + 'px';
            }
        },
        topResize({node, nodeInx, data, split}){},

    },
    mounted() {
        this.initHeight();
    }

}
</script>

<style scoped lang="less">

</style>
