<template>
    <div class="com-chart" ref="chart"></div>
</template>

<script>
import echarts from "echarts"

export default {
    name: "com-chart",
    data(){
        return {}
    },
    props : {
        options : Object
    },
    methods : {
        init(){
            let chartDom = this.$refs.chart;
            let myChart = echarts.init(chartDom);
            let {options} = this;
            options && myChart.setOption(options);
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style scoped>
.com-chart {
    width: 100%;
    height: 100%;
}
</style>
