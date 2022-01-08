<!--
    泡泡图
    linxp
    2021.05.12
 -->
<template>
    <div class="bubble-chart-center" ref="bubble-chart"></div>
</template>
<script>
/**
 *  @property {Array} 	data	图例数据
 *    @value {
                condition: ["不说", "只做"], 区间范围
                number: 5     随机数量
            }
 */
import echarts from "echarts";
export default {
    name: "bubble-chart-center",
    props: {
        data: {
            type: Array,
            default() {
                return [

                ];
            }
        }
    },
    data() {
        return {
            // 中间线
            centerLine: [
                {
                    name: "只做",
                    xAxis: 40,
                    label: { position: "end" }
                },
                {
                    name: "只说",
                    yAxis: 40,
                    label: { position: "end" }
                },
                {
                    name: "不做",
                    xAxis: 40,
                    label: { position: "start" },
                    lineStyle: { width: 0 }
                },
                {
                    name: "不说",
                    yAxis: 40,
                    label: { position: "start" },
                    lineStyle: { width: 0 }
                }
            ]
        };
    },
    computed: {
        /**
         * 根据用户提供条件 随机渲染点
         */
        marksData() {
            const { data } = this;
            let dataList = [];
            data.forEach((item) => {
               let points = this.getRandomRange(item.condition);
               for(let i = 0; i < item.number; i++ ){
                   dataList.push(
                       {
                           value: [this.randomNum(points.x[0],points.x[1]),this.randomNum(points.y[0],points.y[1])]
                       }
                   )
               }
            });
            return dataList
        }
    },
    methods: {
        /**
         * 根据关键词获取范围
         * @param {Array} condition 条件
         */
        getRandomRange(condition) {
            let result = `${condition.includes("不说") ? '0' : '1'}${condition.includes("不做") ? '0' : '1'}`;

            switch (result) {
                case '01':
                    return {
                        x: [2, 38],
                        y: [42, 78]
                    };
                case '11':
                    return {
                        x: [42, 78],
                        y: [42, 78]
                    };
                case '10':
                    return {
                        x: [42, 78],
                        y: [2, 38]
                    };
                default:
                    return {
                        x: [2, 38],
                        y: [2, 38]
                    };
            }
        },
        /**
         * 生成随机数
         * @param {number} minNum 最小值
         * @param {number} maxNum 最大值
         */
        randomNum(minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);
                    break;
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                    break;
                default:
                    return 0;
                    break;
            }
        },
        /**
         * 泡泡图表配置项
         */
        setOptions() {
            const { marksData, centerLine } = this;
            return {
                tooltip: {
                    show: false
                },
                grid: {
                    left: 50,
                    right: 50,
                    bottom: 20,
                    top: 20,
                    containLabel: true
                },
                xAxis: {
                    min: 0,
                    max: 80,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#eee"
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    max: 80,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#eee"
                        }
                    }
                },
                series: [
                    {
                        type: "scatter",
                        data: marksData,
                        label: {
                            show: false
                        },
                        symbolSize: 16,
                        itemStyle: {
                            color: "rgba(64,144,255,0.45)",
                            borderColor: "#4090FF",
                            borderWidth: 1
                        },
                        // 中心点交集象限轴
                        markLine: {
                            symbol: ["arrow", "arrow"],
                            silent: true, // 是否不响应鼠标事件
                            precision: 2, // 精度
                            lineStyle: {
                                type: "solid",
                                color: "#4090FF"
                            },
                            label: {
                                color: "rgba(0,0,0,0.65)",
                                position: "end",
                                formatter: "{b}"
                            },
                            data: centerLine
                        }
                    }
                ]
            };
        }
    },
    mounted() {
        var myChart = echarts.init(this.$refs["bubble-chart"]);
        myChart.setOption(this.setOptions());
    }
};
</script>
<style lang="less" scoped>
.bubble-chart-center {
    width: 100%;
    height: 610px;
}
</style>
