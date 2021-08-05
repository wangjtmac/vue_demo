<template>
    <div class="modelNode node selectn"
         ref="node"
         :style="flowNodeContainer"
         @mouseenter="showDelete"
         @mouseleave="hideDelete"
         @mouseup="changeNodeSite"

    >
        <div class="flow-shadow">
            <!--<div class="flow-node-header">
                <div class="edit-icon">
                    <i class="el-icon-edit" title="重命名" @click="editNode"></i>&nbsp;
                    <i class="el-icon-close" title="删除" @click="deleteNode"></i>&nbsp;
                </div>
            </div>-->
            <div class="flow-node-body" @dblclick="editAttr(node)">
                <!-- <div class="m-icon">
                     <svg class="eda_icon">
                         <use :xlink:href="node.ico"></use>
                     </svg>
                 </div>-->
                <i class="dc-link_dot" title="连线" v-show="node.canLink !== undefined ? node.canLink : true"
                   :class="nodeClass"></i>
                <div class="flow-name" :title="node.name">{{ node.name }}</div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "ModelNode",
    props: {
        node: Object
    },
    data() {
        return {
            // 控制节点操作显示
            mouseEnter: false,
            timer: null
        }
    },
    methods: {
        editAttr(node) {
            this.$emit('editAttr', node);
        },
        // 删除节点
        deleteNode() {
            this.$emit('deleteNode', this.node)
        },
        // 编辑节点
        editNode() {
            this.$emit('editNode', this.node.id)
        },
        // 鼠标进入
        showDelete() {
            this.mouseEnter = true
        },
        // 鼠标离开
        hideDelete() {
            this.mouseEnter = false
        },
        // 鼠标移动后抬起
        changeNodeSite() {
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$emit('changeNodeSite', {
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            }, 300)

        },
    },
    computed: {
        flowNodeContainer: {
            get() {

                return {
                    position: 'absolute',
                    top: this.node.top,
                    left: this.node.left,
                }
            }
        },
        nodeClass() {
            var nodeclass = {};
            nodeclass['flow-node-drag'] = true;
            return nodeclass
        },
        nodeIco() {
            return this.node.ico;
        }
    }

}
</script>

<style scoped>
.modelNode {
    /*z-index: 10;*/
}


.edit-icon {
    float: right;
    line-height: 20px;
}

.node {
    border-radius: 6px;
}

.flow-node-header {
    background-color: #fff;
    height: 20px;
    cursor: pointer;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: #66a6e0;
    border: 1px solid #66a6e0;
    border-bottom: none;
}
.dc-link_dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border:1px solid #66a6e0;
    display: block;
    position: absolute;
    bottom: -6px;
    left: 50%;
    box-sizing: border-box;
    margin-left: -4px;
    z-index: 20;
    background: #fff;
}

.flow-node-header i {
    line-height: 20px;
    vertical-align: middle;
}


.flow-node-body {
    position: relative;
    padding: 5px 6px 5px 6px;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #66a6e0;
}

.node:hover .flow-name, .node:hover .eda_icon {
    color: #289bf1;
}

.flow-name {
    /*padding: 0 5px 10px 5px;*/
    font-size: 16px;
    color: #666;
    /*position: absolute;*/
    /*left: 50%;*/
    /*top:100%;*/
    white-space: nowrap;
    /*transform: translate(-50% , 0);*/
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.m-icon {
    height: 28px;
    margin: auto;
    text-align: center;
}

.m-icon > .eda_icon {
    width: 28px;
    height: 28px;
}

.flow-shadow {
    background: none;
    border-radius: 6px;
}

.flow-shadow:hover {
    box-shadow: #66a6e0 0 0 12px 0;
}
</style>
