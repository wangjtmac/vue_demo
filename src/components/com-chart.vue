<template>
  <div class="com-chart" ref="chart"></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: 'ComChart',
  props: {
    options: Object
  },
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let chartDom = this.$refs.chart
      let myChart = echarts.init(chartDom)
      let { options } = this
      options && myChart.setOption(options)
    }
  }
}
</script>

<style scoped>
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
