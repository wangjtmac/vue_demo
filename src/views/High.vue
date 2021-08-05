<template>
    <div class="High">
        <h4 class="title">Line charts</h4>
        <div class="chartContain">
            <high-chart :options="chart1" :styles="styles" ></high-chart>

            <high-chart :options="chart3" :styles="styles" ></high-chart>
            <high-chart :options="chart4" :styles="styles" ></high-chart>
            <high-chart :options="chart5" :styles="styles" ></high-chart>
            <high-chart :options="chart6" :styles="styles" ></high-chart>
            <high-chart :options="chart7" :styles="styles" ></high-chart>
            <high-chart :options="chart8" :styles="styles" ></high-chart>
            <high-chart :options="chart9" :styles="styles" ></high-chart>
            <high-chart :options="chart10" :styles="styles" ></high-chart>
            <high-chart :options="chart11" :styles="styles" ></high-chart>
        </div>
        <h4 class="title">Area charts</h4>
        <div class="chartContain">
            <high-chart :options="chart12" :styles="styles" ></high-chart>
            <high-chart :options="chart13" :styles="styles" ></high-chart>
            <high-chart :options="chart14" :styles="styles" ></high-chart>
            <high-chart :options="chart15" :styles="styles" ></high-chart>
        </div>
        <high-chart :options="chart2" :styles="styles" ></high-chart>


    </div>
</template>

<script>
import HighChart from "@/components/HighChart";
import {high} from "@/assets/highOptions";

export default {
    name: "High" ,
    mixins : [high],
    components : {
        HighChart
    },
    data(){
        return {
            styles : {
                width : "50%"
            },
        }
    },
    mounted() {

    }
}
</script>

<style scoped>
    .chartContain {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    .title {
        padding: 10px;
        font-size: 18px;
        color: #555;
    }
</style>
