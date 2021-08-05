<!--
 知识工程通用dialog组件
 基于element-ui的dialog
 设置了一些默认值，且对弹窗内容keep-alive,是的内容可以用v-if控制来实现弹窗未使用时不加载内容
 @Author: zhanbh
 @Date: 2019-12-16
-->
<template>
    <el-dialog
            :custom-class="customClass"
            :close-on-click-modal="closeOnClickModal"
            :append-to-body="appendToBody"
            :top="top"
            v-bind="$attrs"
            v-on="$listeners">
        <slot name="title" slot="title"></slot>
        <slot name="footer" slot="footer"></slot>
        <transition name="el-fade-in-linear">
            <slot v-if="destroyed"></slot>
            <keep-alive v-else>
                <slot></slot>
            </keep-alive>
        </transition>
    </el-dialog>
</template>
<script>
    export default {
        name: "CommonDialog",
        inheritAttrs: false,
        props: {
            appendToBody: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            top: {
                type: String,
                default: '10vh'
            },
            destroyed : {
                type : Boolean ,
                default : true
            },
            customClass : {
                type :String ,
                default : "ce-common_dialog"
            }
        },
        data() {
            return {
                reNew : false
            };
        },
        methods : {
            clearD (){

            }
        }
    };
</script>
<style scoped>

</style>
