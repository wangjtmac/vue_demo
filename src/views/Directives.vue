<template>
  <div>
    <span v-countdown="160000" formatter="HH小时mm分ss秒"></span>
    <level :level="1" :title="title">{{ title }}</level>
    <el-input type="text" v-model="inpVal" v-input-limit:custom></el-input>
    <!--<input type="text" v-model.number="text" v-input-limit:number />-->
  </div>
</template>

<script type="text/jsx">
import Level from "../components/Level";

//import * as CountOut from "@/api/directives/timeout.js"
var Child = {
  render(createElement) {
    return createElement('p', 'text')
  }
}

export default {
  name: 'Direcives',
  components: {
    Level
  },
  // directives : { countdown : CountOut.default.countdown}
  data() {
    return {
      title: '特性',
      text: '',
      inpVal: '',
      rule: {},
      reg: /^[^A-Za-z_]|[^A-Za-z_0-9]+/
    }
  },
  render(createElement, hack) {
    let childNode = createElement(Child)
    let l = createElement(
      'Level',
      {
        props: {
          level: 1,
          title: 'level'
        }
      },
      'level'
    )
    return (
      <div id="myDiv" domPropsInnerHTML="content">
        {' '}
      </div>
    )
  }
}
</script>

<style scoped>
</style>
