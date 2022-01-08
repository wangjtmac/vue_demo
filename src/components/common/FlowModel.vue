<!--
流程模块组件
-->
<template>
    <div class="flowModel" :style="{ height: height }">
        <h1 class="flowModel_title">{{ title }}</h1>
        <ul class="flowModel_list" :class=" {'flowModel_vertical' : mode === 'vertical'}">
            <template v-for="(flow, inx) in flowList">
                <div class="flowModel_box" :class="'flowModel_'+size" :key="inx">
                    <li class="flowModel_item" v-for="(item , i) in flow" :key="i">
                        <div class="flowModel_icon" :class="'flowModel_icon_'+size" :title="item.typeName">
                            <i :class="item.icon"></i>
                        </div>
                        <p class="flowModel_name" :class="'flowModel_name_'+size">{{ item.label }}</p>
                    </li>
                </div>
                <div
                        class="flowModel_arrow"
                        :class="{'flowModel_arrow_vertical' : mode === 'vertical'}"
                        :key="inx + 'a'"
                        v-if="inx !== flowList.length - 1"
                ></div>
            </template>
        </ul>
    </div>
</template>

<script>
export default {
    name: "FlowModel",
    props: {
        title: {
            type: String,
            default: "",
        },
        flowList: {
            type: Array,
            default: () => [],
        },
        height: {
            type: String,
            default: "",
        },
        mode : {
            type : String ,
            default : "horizontal" ,//horizontal / vertical
        },
        size : {
            type : String ,
            default : "large" ,// large / small
        }
    },
};
</script>

<style scoped lang="less">
.flowModel {
    padding: 16px 24px 0;
    border: 1px dashed rgba(0, 136, 255, 0.45);
    border-radius: 4px;
    background: rgba(0, 136, 255, 0.04);
    &_title {
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        line-height: 18px;
        color: #0088ff;
        text-align: center;
    }

    &_list {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &_large {
        flex: 1;
        max-width: 242px;
        > .flowModel_item {
            padding: 11px 16px;
        }
    }
    &_small {
        flex: 1;
        max-width: 220px;
        > .flowModel_item {
            padding: 10px;
        }
    }
    &_vertical {
        flex-direction: column;
        height: calc(100% - 18px);
        >.flowModel_box {
            max-width: none;
            width:100%;
        }
        > .flowModel_small {
            max-height: 140px;
        }
        > .flowModel_large {
            max-height: 150px;
        }

    }
    &_item {
        background: #ffffff;
        box-shadow: 0 0 8px 0 rgba(16, 0, 0, 0.15);
        border-radius: 2px;
        display: flex;
        align-items: center;
        flex: 1;
        margin: 24px 0;
    }

    &_icon {
        background: url("../../assets/images/flow-bg.png") no-repeat center;
        background-size: contain;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        &_small {
            min-width: 72px;
            width: 72px;
            height: 72px;
        }
        &_large {
            min-width: 80px;
            width: 80px;
            height: 80px;
        }
        > i {
            font-size: 24px;
        }
    }

    &_name {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        padding: 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &_small {
            width: calc(100% - 88px);
        }
        &_large {
            width: calc(100% - 96px);
        }
    }

    &_arrow {
        width: 52px;
        height: 26px;
        background: #ddd;

        &_vertical {
            width: 26px;
            height: 52px;
        }
    }
}
</style>
