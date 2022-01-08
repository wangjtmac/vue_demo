<template>
    <div class="echarts">
        <h4 class="title">Line charts</h4>
        <div class="chartContain">
            <com-chart :options="option1"></com-chart>
            <bubble-chart></bubble-chart>
        </div>
    </div>
</template>

<script>
import ComChart from "@/components/com-chart"
import {echartsOpt} from "@/assets/echartsOptions";
import bubbleChart from "@/components/bubble-chart"
export default {
    name: "echarts",
    mixins: [echartsOpt],
    components: {
        ComChart ,
        bubbleChart
    }
}
</script>

<style scoped lang="less">
.chartContain {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    .com-chart {
        height: 400px;
        width: 50%;
        background-image: url("https://www.highcharts.com/samples/graphics/sand.png");
        background-position: center;
        background-repeat: repeat;
    }
}

.title {
    padding: 10px;
    font-size: 18px;
    color: #555;
}
</style>
