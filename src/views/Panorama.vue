<template>
    <!--  全景图  -->
    <div class="panorama">
        <el-checkbox v-model="isAdd">修改</el-checkbox>
        <el-checkbox v-model="isEdit">编辑</el-checkbox>
        <el-checkbox v-model="isDelete">删除</el-checkbox>
        <el-button type="primary" @click="resetRow">修改row</el-button>
        <div class="panorama_contain ">
            <ul class="panorama-item"
                v-for="(item , k) in list" :key="k">
                <li class="panorama-row_head">{{ item.label }}</li>
                <li class="panorama-row_li" :class="`panorama-row_${li.type}`"
                    v-for="(li , inx) in item.rows()"
                    :key="inx"
                >
                    <span v-if="li.tip" class="panorama-row_tip">{{ li.tip }}</span>
                    <span>{{ li.label }}</span>
                    <span v-if="li.isChecked && li.isChecked()" class="panorama-row_check">
                        <em class="el-icon-check"></em>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Panorama",
    data() {
        return {
            isAdd: false,
            isEdit: false,
            isDelete: false,
            list: {
                ele_head: {
                    label: "变更元",
                    rows: () => {
                        return this.row_ele;
                    }
                },
                table_head: {
                    label: "维表/事实表",
                    rows: () => {
                        return this.row_table;
                    }
                },
                limited_head: {
                    label: "通用限定",
                    rows: () => {
                        return this.row_limited;
                    }
                },
                atom_head: {
                    label: "原子指标",
                    rows: () => {
                        return this.row_atom;
                    }
                },
                derive_head: {
                    label: "派生指标",
                    rows: () => {
                        return this.row_derive;
                    }
                },
                summary_head: {
                    label: "汇总表",
                    rows: () => {
                        return this.row_summary;
                    }
                },
                case_head: {
                    label: "指标方案",
                    rows: () => {
                        return this.row_case;
                    }
                },
                label_head: {
                    label: "标签主体",
                    rows: () => {
                        return this.row_label;
                    }
                },
            },
            row_ele: [
                {
                    label: "渉稳人员",
                    tip: '事实',
                    type: 'warning',
                    isChecked :()=> false
                }, {
                    label: "飞机搭乘",
                    tip: "事实",
                    type: 'success' ,
                    isChecked :()=> false
                }, {
                    label: "第一列",
                    tip: "事实",
                    type: 'primary' ,
                    isChecked :()=> false
                },
            ],
            row_table: [
                {
                    label : "事实结构名称" ,
                }
            ],
            row_limited: [],
            row_atom: [],
            row_derive: [],
            row_summary: [],
            row_case: [],
            row_label: [],
        }
    },
    methods : {
        resetRow(){
            this.row_ele[0].isChecked = ()=> true;
        }
    }
}
</script>

<style scoped lang="less">
.row-item {
    border-radius: 2px;
    text-align: center;
    padding: 0 20px;
    font-size: 14px;
}

@successColor: #13BBB0;
@warningColor: #FFA200;
@primaryColor: #0088FF;
.panorama {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;

    &_contain {
        border: 1px solid #ddd;
        background: rgba(0, 0, 0, 0.04);
        height: calc(100% - 2rem);
        box-sizing: border-box;
        padding: 2rem;
        display: flex;
        justify-content: space-around;
    }

    &-item {
        min-width: 120px;
        max-width: 172px;
        display: flex;
        flex-direction: column;
    }

    &-row {
        &_head {
            .row-item();
            height: 44px;
            background: rgba(0, 136, 255, 0.65);
            color: #fff;
            line-height: 44px;
        }

        &_li {
            .row-item();
            height: 60px;
            background: #fff;
            color: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(0, 0, 0, 0.15);
            margin-top: 1.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
        }

        &_success {
            color: @successColor;
            border-color: @successColor;
            >.panorama-row_tip {
                background: @successColor;
            }
            >.panorama-row_check {
                border-bottom-color: @successColor;
                border-right-color: @successColor;
            }
        }
        &_warning {
            color: @warningColor;
            border-color: @warningColor;
            >.panorama-row_tip {
                background: @warningColor;
            }
            >.panorama-row_check {
                border-bottom-color: @warningColor;
                border-right-color: @warningColor;
            }
        }
        &_primary {
            color: @primaryColor;
            border-color: @primaryColor;
            >.panorama-row_tip {
                background: @primaryColor;
            }
            >.panorama-row_check {
                border-bottom-color: @primaryColor;
                border-right-color: @primaryColor;
            }
        }
        &_tip {
            position: absolute;
            left: 1px;
            top: 1px;
            color: #fff;
            font-size: 12px;
            padding: 0 8px 0 2px;
            line-height: 16px;
            border-radius: 2px 8px 8px 0;
        }
        &_check {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            > em {
                position: absolute;
                top: -3px;
                left: -3px;
                color: #fff;
            }
        }
    }
}
</style>
