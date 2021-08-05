<!--
 通用的表格组件 将el-table的使用js配置化

 支持el-table绝大部分功能
 el-table的属性与事件监听不变，按官网的来
 el-table-column 通过js对象配置，js属性参考官网el-table-column的props配置

 @param globalBind 列的全局配置，提供一个对列的统一配置
 @param columns 列的配置项数组
        column对象除el-table-column的props外扩展三个主要属性
        isHidden 是否展示该列
        isHtml 是否是html段
        translator({value,row,prop,column,mergedColumn,index}) 值的转换函数

 插槽： 列的内容插槽名为: 自身prop   列头部插槽为: header-自身prop

 对el-table组件引用：ref="table"

 @Author: zhanbh
 @Date: 2019-09-29
-->
<template>
    <el-table
            class="normal-table"
            style="width: 100%"
            ref="table"
            v-on="$listeners"
            v-bind="Object.assign({},tableAttrs, $attrs)"
    >
        <template v-for="(column , index) in mergedColumns" v-if="!column.extend.isHidden">
            <el-table-column
                    v-if="!column.props.type"
                    :key="index"
                    v-bind="column.props"
                    v-on="column.extend.events"
            >
                <slot slot="header"
                      :name="`header-${column.props.prop}`"
                      slot-scope="{$index}"
                      :column="column.column"
                      :mergedColumn="column"
                      :prop="column.props.prop"
                      :index="index"
                      :$index="$index"
                >
                    {{column.props.label}}
                </slot>
                <slot :name="column.props.prop"
                      slot-scope="{row,$index}"
                      :row="row"
                      :prop="column.props.prop"
                      :value="row[column.props.prop]"
                      :column="column.column"
                      :mergedColumn="column"
                      :index="index"
                      :$index="$index"
                >
                    <template v-if="column.extend.isHtml" v-html="column.extend.translator ? column.extend.translator({
                        value: row[column.props.prop],
                        row: row,
                        prop: column.props.prop,
                        column: column.column,
                        mergedColumn: column,
                        index
                    }) : row[column.props.prop]"></template>
                    <template v-else>
                        {{
                            column.extend.translator ? column.extend.translator({
                            value: row[column.props.prop],
                            row: row,
                            prop: column.props.prop,
                            column: column.column,
                            mergedColumn: column,
                            index
                            }) : row[column.props.prop]
                        }}
                    </template>
                </slot>
            </el-table-column>
            <el-table-column
                    v-else
                    :key="index"
                    v-bind="column.props"
                    v-on="column.extend.events"
            >
            </el-table-column>
        </template>
        <slot name="append" slot="append"></slot>
    </el-table>
</template>
<script>
    let extendProps = ['bind', 'events', 'isHtml', 'isSlot', 'translator', 'isHidden'];
    export default {
        name: "CommonTable",
        inheritAttrs: false,
        props: {
            columns: {
                type: Array,
                default() {
                    return [];
                }
            },
            globalBind: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                tableAttrs: {
                    'border': true,
                    'stripe': true,
                    'size': 'mini'
                },
                columnsAttrs: {
                    'show-overflow-tooltip': true
                }
            };
        },
        computed: {
            mergedColumns() {
                let { columnsAttrs, globalBind = {}, columns } = this;
                let result = columns.map(column => {
                    let props = Object.assign( {}, columnsAttrs, globalBind, column );
                    if (column.bind) {
                        props = Object.assign(props, column.bind);
                    }
                    let extend = {};
                    extendProps.forEach(key => {
                        if (column.hasOwnProperty(key)) {
                            delete props[key];
                            extend[key] = column[key];
                        }
                    });
                    return {
                        props,
                        column,
                        extend
                    };
                });
                return result
            }
        }
    };
</script>
<style>

</style>
