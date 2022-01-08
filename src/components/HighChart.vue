<template>
    <div class="HighChart"></div>
</template>

<script>
import Highcharts from 'highcharts/highcharts';
import wordcloud from "highcharts/modules/wordcloud"
import annotations from "highcharts/modules/annotations"
wordcloud(Highcharts)
annotations(Highcharts)



export default {
    name: "HighChart",
    props : ["options" , "styles"],
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            this.$el.style.width = (this.styles.width || 800+ 'px') ;
            this.$el.style.height = (this.styles.height || 400+ 'px') ;
            let {options} = this;
            if(options.chart && !options.chart.backgroundColor){
                options.chart.backgroundColor = "";
            }else if(!options.chart){
                options.chart = {backgroundColor : ""}
            }
            this.chart = new Highcharts.Chart(this.$el, options);
        }
    }
}
</script>

<style scoped>
    .HighChart {
        background-image:url("https://www.highcharts.com/samples/graphics/sand.png");
        background-position: center;
        background-repeat: repeat;
        border: 1px solid #ddd;
        margin:-1px -1px 0 0;
        box-sizing: border-box;
    }
</style>
