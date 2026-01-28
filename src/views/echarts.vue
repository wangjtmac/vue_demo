<template>
    <div class="echarts">
        <h4 class="title">Line charts</h4>
        <div class="chartContain">
            <com-chart :options="option1"></com-chart>
            <bubble-chart :data="bubbleData"></bubble-chart>
        </div>
    </div>
</template>

<script>
import { echartsOpt } from "@/assets/echartsOptions.js";
import bubbleChart from "@/components/bubble-chart";
import ComChart from "@/components/com-chart";

export default {
    name: "Echarts",
    components: {
        ComChart ,
        bubbleChart
    },
    mixins: [echartsOpt],
    data() {
        return {
            bubbleData: [
                {
                    condition: ["不说", "只做"],
                    number: 5
                },
                {
                    condition: ["只说", "不做"],
                    number: 5
                }
            ]
        }
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
