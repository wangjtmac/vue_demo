<template>
    <div class="dc-page p20">
        <ce-step :data="steps" v-model="activeStep"  :space="300"></ce-step>
        <line-model>
            <FlowModel slot="top" :title="title1" :flow-list="list1"/>
            <flow-model slot="left" size="small" :title="title3" height="390px" :flow-list="list3"/>
            <flow-model slot="right" size="small" mode="vertical" height="390px" :title="title2" :flow-list="list2"/>
        </line-model>

    </div>
</template>

<script>
import LineModel from "@/components/common/LineModel.vue";
import FlowModel from "@/components/common/FlowModel";
import CeStep from "@/components/common/CeStep";

export default {
    name: "dcPage",
    components: {
        LineModel,
        FlowModel,
        CeStep
    },
    data() {
        return {
            activeStep: 0,
            steps: [
                {
                    label: "创建模型",
                    clickFn : (step , i)=>{
                        this.activeStep = i;
                    }
                }, {
                    label: "模型开发",
                    clickFn : (step , i)=>{
                        this.activeStep = i;
                    }
                }, {
                    label: "模型训练",
                    clickFn : (step , i)=>{
                        this.activeStep = i;
                    }
                }
            ],
            title1: "业务定义",
            title2: "标签中心",
            title3: "数据中心",
            list1: [
                [
                    {
                        icon: "el-icon-first-aid-kit",
                        label: "业务主体",
                        type: "",
                        typeName: ""
                    },

                ],
                [
                    {
                        icon: "el-icon-s-finance",
                        label: "业务事实",
                        type: "",
                        typeName: ""
                    },
                ],
                [
                    {
                        icon: "el-icon-position",
                        label: "发布管理",
                        type: "",
                        typeName: ""
                    }
                ]
                ,
                [
                    {
                        icon: "el-icon-cpu",
                        label: "自动物理化",
                        type: "",
                        typeName: ""
                    }
                ]

            ],
            list2: [
                [
                    {
                        icon: "el-icon-cpu",
                        label: "标签管理",
                        type: "",
                        typeName: ""
                    }
                ], [
                    {
                        icon: "el-icon-cpu",
                        label: "标签服务",
                        type: "",
                        typeName: ""
                    }
                ],
            ],
            list3: [
                [
                    {
                        icon: "el-icon-cpu",
                        label: "通用统计周期",
                        type: "",
                        typeName: ""
                    }, {
                    icon: "el-icon-cpu",
                    label: "通用统计周期",
                    type: "",
                    typeName: ""
                }, {
                    icon: "el-icon-cpu",
                    label: "通用统计周期",
                    type: "",
                    typeName: ""
                },
                ], [
                    {
                        icon: "el-icon-cpu",
                        label: "通用统计周期",
                        type: "",
                        typeName: ""
                    },
                ], [
                    {
                        icon: "el-icon-cpu",
                        label: "通用统计周期",
                        type: "",
                        typeName: ""
                    },
                ], [
                    {
                        icon: "el-icon-cpu",
                        label: "通用统计周期",
                        type: "",
                        typeName: ""
                    },
                ]
            ]
        }
    }
};
</script>

<style>
</style>
