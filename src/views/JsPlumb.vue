<template>
    <div class="jsplumb">
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
        </div>
        <!-- 右侧内容区 -->
        <div class="canvas-content" @dragover="allowDrop"
             @drop="drop">
            <common-panel ref="panel"
                          :max-x="maxX" :max-y="maxY"
                          :min-x="minX" :min-y="minY"
                          :zoom="panel.zoom"
                          :x="panel.x"
                          :y="panel.y"
                          @changeZoom="updatePos"
            >
                <flow-panel-et  ref="flow" :modelParams="{loading:false}"/>
            </common-panel>

        </div>
    </div>
</template>

<script>
import FlowPanelEt from "@/views/FlowPanelEt";
import {DemoJsplumb} from "@/views/jsplumb";
import commonPanel from "@/components/common-panel"

export default {
    name: "JsPlumb",
    mixins:[DemoJsplumb],
    components:{FlowPanelEt,commonPanel},
    computed: {
        maxX(){
            return window.screen.width;
        },
        maxY (){
            return window.screen.height;
        },
        minX(){
            return -1* window.screen.width;
        },
        minY(){
            return -1 * window.screen.height;
        }
    },
    data(){
        return {
            panel : {
                x : 0 ,
                y : 0,
                zoom : 1,
            }
        }
    },
    methods : {
        updatePos(arg){
            const vm = this;
            vm.panel = arg;
            this.$refs.flow.setZoom(arg.zoom);
        },
        allowDrop(e){
            this.$refs.flow.allowDrop(e);
        },
        drop(e){
            this.$refs.flow.drop(e);
        },
    }

}
</script>

<style scoped>
.contain {
    width: 100%;
    height: 100%;
}
.jsplumb {
    display: flex;
    height: 500px;
}
.relation-box {
    position: relative;
    height: 600px;
}

.node {
    position: absolute;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px 30px;
}
.main {
    width: 100%;
    height: 100%;
    display: flex;
}
.left-menu{
    width: 200px;
    height: 100%;
    border: 1px solid #ccc;
}
.left-menu li{
    width: 200px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    cursor: move;
}
.canvas-content{
    flex: 1;
    background: lightcyan;
    position: relative;
}
.canvas-con{
    width: 100%;
    height: 100%;
}
.canvas{
    width: 50px;
    height: 50px;
    position: relative;
    left: 20px;
    top: 20px;
    transform-origin: 50% 50%;
    cursor: pointer;
}
.model-list-li{
    max-width: 140px;
    height: 44px;
    line-height: 44px;
    border: 2px dashed #fff;
    position: absolute;
    z-index: 4;
    cursor: move;
    font-size: 12px;
    color: #fff;
    background-color: #2583ff;
    padding: 0 16px 0 20px;
}
/* 保存 */
.save-btn{
    position: absolute;
    width: 100px;
    height: 50px;
    color: #fff;
    background-color: #2583ff;
    right: 50px;
    top: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    cursor: pointer;
    z-index: 10;
}
.clear-btn{
    top: 120px;
}
/* 右键菜单 */
.right-menu{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: transparent;
}
.right-menu-con{
    margin: 0;
    padding: 5px 0;
    min-width: 200px;
    position: absolute;
    list-style: none;
    background-color: rgba(255, 255, 255, .98);
    border: 1px solid #eee;
    -webkit-box-shadow: 5px 5px 30px rgba(0, 0, 0, .1);
    box-shadow: 5px 5px 30px rgba(0, 0, 0, .1);
    border-radius: 2px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.right-menu-con li{
    position: relative;
    font-size: 12px;
    color: #333;
    height: 26px;
    line-height: 26px;
    padding-left: 10px;
    /* padding-right: 10px; */
    cursor: pointer;
    -webkit-transition: background-color .1s ease;
    transition: background-color .1s ease;
}
.right-menu-con li:hover{
    background: cyan;
}
</style>
