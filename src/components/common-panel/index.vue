<!--
 通用画板
 这里实现画布拖拽及放大缩小等画布功能
 @Author: zhanbh
 @Date: 2020-08-06
-->
<template>
    <div class="common-panel"
         :class="cssClasses"
         @mousewheel.prevent="handleScrollPanelThrottle"
         @mousedown.left.capture ="handleMouseDown">
        <div class="common-panel__canvas"
             ref="canvas"
             :style="transform">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export { default } from './main';
</script>
<style scoped lang="less">
    .common-panel{
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &__canvas{
            position: relative;
            width: 100%;
            height: 100%;

            transform-origin: left top;
        }

        &--to-move {
            cursor: grab;
        }
        &--moving{
            cursor: grabbing;
        }

        &__move-mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
        }
    }
</style>
