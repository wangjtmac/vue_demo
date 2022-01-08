<template>
    <div  class="ce-split_cont" :class="{'active' : !!dragTarget}">
        <span>{{item.label}}</span>
        <div class="ce-split_left ce-handle_resize" ><em class="ce-split_resize"></em></div>
        <div class="ce-split_right ce-handle_resize"
             @mousedown="setDragTarget($event , item , 'right')"
        ><em class="ce-split_resize"></em></div>
        <div class="ce-split_top ce-handle_resize"><em class="ce-split_resize"></em></div>
        <div class="ce-split_bottom ce-handle_resize"><em class="ce-split_resize"></em></div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Split",
    props : {
        item : Object,
        itemId : String
    },
    data (){
        return {
            dragTarget : null ,
            state : {
                resizing : false
            }
        }
    },
    methods : {
        setDragTarget(e , item , dir ){
            const vm = this , {itemId} = vm;
            let event = e || window.event;
            vm.dragTarget = item;
            event.stopPropagation();
            event.preventDefault();
            this.state.resizing = true;
            const drag = (event) => {
                if (event.button !== 0) return;
                let splitter =  vm.$el.parentNode.clientWidth;
                let parentRect = vm.$el.parentNode.parentNode.getBoundingClientRect();
                let splitSize =((event.x - parentRect.left - splitter - 8 ) / parentRect.width) * 100;
                vm.$emit('splitResize', event, itemId, splitSize , dir );
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
    }
}
</script>

<style scoped lang="less" src="./layout.less"></style>
